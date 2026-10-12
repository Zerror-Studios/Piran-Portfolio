"use client"

import { usePathname } from "next/navigation"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const GlobalHeaderHide = () => {
  const pathname = usePathname()

  useGSAP(
    () => {
      // 1. Force window and Lenis scroll to top on route change
      window.scrollTo(0, 0)
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true, force: true })
      }

      // 2. Reset header wrapper transform immediately
      const headerWrapper = document.querySelector(".header_wrapper")
      if (headerWrapper) {
        gsap.set(headerWrapper, { transform: "translateY(0rem)" })
      }

      const sections = gsap.utils.toArray("[data-hide-header]")
      if (!sections.length) return

      sections.forEach((section) => {
        const hide = () => {
          gsap.to(headerWrapper, {
            transform: "translateY(6rem)",
            duration: 0.4,
            ease: "power2.inOut",
            overwrite: true,
          })
        }

        const show = () => {
          gsap.to(headerWrapper, {
            transform: "translateY(0rem)",
            duration: 0.4,
            ease: "power2.inOut",
            overwrite: true,
          })
        }

        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom center",
          onEnter: hide,
          onLeave: show,
          onEnterBack: hide,
          onLeaveBack: show,
        })
      })

      // Refresh ScrollTrigger after recalculating layout positions on the new page
      ScrollTrigger.refresh()

      return () => {
        if (headerWrapper) {
          gsap.set(headerWrapper, { transform: "translateY(0rem)" })
        }
      }
    },
    { dependencies: [pathname] }
  )

  return null
}

export default GlobalHeaderHide
