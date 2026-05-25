import { useEffect, useRef } from 'react'

interface Particle {
  x:      number
  y:      number
  homeX:  number
  homeY:  number
  vx:     number
  vy:     number
  radius: number
}

// ── Tuning ────────────────────────────────────────────
const PARTICLE_COUNT  = 160     // số hạt
const CONNECT_DIST    = 160     // khoảng cách kết nối (px)
const MOUSE_RADIUS    = 190     // vùng ảnh hưởng chuột
const MOUSE_FORCE     = 7.0     // lực đẩy
const SPRING_K        = 0.052   // lực kéo về vị trí gốc
const DAMPING         = 0.80    // giảm chấn
const MAX_DISP_RATIO  = 0.18    // dịch chuyển tối đa = 18% chiều rộng
// ────────────────────────────────────────────────────────

export default function PlexusBackground() {
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const mouseRef     = useRef({ x: -99999, y: -99999 })
  const particlesRef = useRef<Particle[]>([])
  const animRef      = useRef<number>(0)
  const sizeRef      = useRef({ W: 0, H: 0 })

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!

    /* ── Khởi tạo hạt tại vị trí ngẫu nhiên ── */
    const buildParticles = () => {
      const W = window.innerWidth
      const H = window.innerHeight
      canvas.width  = W
      canvas.height = H
      sizeRef.current = { W, H }

      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => {
        const hx = Math.random() * W
        const hy = Math.random() * H
        return {
          x: hx, y: hy,
          homeX: hx, homeY: hy,
          vx: 0, vy: 0,
          radius: Math.random() * 1.4 + 1.0,
        }
      })
    }

    /* ── Resize: giữ tỉ lệ vị trí tương đối ── */
    const onResize = () => {
      const prevW = sizeRef.current.W || window.innerWidth
      const prevH = sizeRef.current.H || window.innerHeight
      const W = window.innerWidth
      const H = window.innerHeight
      canvas.width  = W
      canvas.height = H
      sizeRef.current = { W, H }

      const ratioX = W / prevW
      const ratioY = H / prevH
      for (const p of particlesRef.current) {
        p.homeX *= ratioX
        p.homeY *= ratioY
        p.x      = p.homeX + (p.x - p.homeX / ratioX) * ratioX
        p.y      = p.homeY + (p.y - p.homeY / ratioY) * ratioY
      }
    }

    buildParticles()
    window.addEventListener('resize', onResize)

    /* ── Chuột ── */
    const onMouseMove  = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY } }
    const onMouseLeave = ()               => { mouseRef.current = { x: -99999, y: -99999 } }
    window.addEventListener('mousemove',  onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)

    /* ── Loop ── */
    const animate = () => {
      const { W, H } = sizeRef.current
      const particles = particlesRef.current
      const mouse     = mouseRef.current
      const maxDisp   = MAX_DISP_RATIO * W

      ctx.clearRect(0, 0, W, H)

      /* Vật lý */
      for (const p of particles) {
        // Lực đẩy từ chuột
        const mx = p.x - mouse.x
        const my = p.y - mouse.y
        const md = Math.sqrt(mx * mx + my * my)
        if (md < MOUSE_RADIUS && md > 0.5) {
          const f = ((MOUSE_RADIUS - md) / MOUSE_RADIUS) ** 1.6 * MOUSE_FORCE
          p.vx += (mx / md) * f
          p.vy += (my / md) * f
        }

        // Lò xo kéo về home
        p.vx += (p.homeX - p.x) * SPRING_K
        p.vy += (p.homeY - p.y) * SPRING_K

        // Giảm chấn
        p.vx *= DAMPING
        p.vy *= DAMPING

        p.x += p.vx
        p.y += p.vy

        // Giới hạn khoảng dịch chuyển
        const dx   = p.x - p.homeX
        const dy   = p.y - p.homeY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > maxDisp && dist > 0) {
          const s = maxDisp / dist
          p.x = p.homeX + dx * s
          p.y = p.homeY + dy * s
          const dot = p.vx * (dx / dist) + p.vy * (dy / dist)
          if (dot > 0) {
            p.vx -= dot * (dx / dist)
            p.vy -= dot * (dy / dist)
          }
        }
      }

      /* Vẽ đường kết nối */
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x
          const dy   = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist > CONNECT_DIST) continue

          const baseAlpha = (1 - dist / CONNECT_DIST) * 0.40

          // Tính mức độ lệch của 2 hạt
          const di = Math.hypot(particles[i].x - particles[i].homeX, particles[i].y - particles[i].homeY)
          const dj = Math.hypot(particles[j].x - particles[j].homeX, particles[j].y - particles[j].homeY)
          const df = Math.min(1, (di + dj) / (maxDisp * 0.7))

          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.strokeStyle = df > 0.15
            ? `rgba(130, 175, 255, ${baseAlpha + df * 0.5})`
            : `rgba(85, 110, 215, ${baseAlpha})`
          ctx.lineWidth = 0.55 + df * 0.75
          ctx.stroke()
        }
      }

      /* Aura chuột */
      if (mouse.x > -9000) {
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, MOUSE_RADIUS)
        g.addColorStop(0,   'rgba(120, 160, 255, 0.13)')
        g.addColorStop(0.5, 'rgba(100, 135, 245, 0.05)')
        g.addColorStop(1,   'rgba(80,  110, 220, 0.00)')
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, MOUSE_RADIUS, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      }

      /* Vẽ hạt */
      for (const p of particles) {
        const disp = Math.hypot(p.x - p.homeX, p.y - p.homeY)
        const df   = Math.min(1, disp / (maxDisp * 0.45))

        ctx.shadowBlur  = df > 0.08 ? 7 * df : 0
        ctx.shadowColor = 'rgba(120, 165, 255, 0.75)'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius + df * 2.0, 0, Math.PI * 2)
        ctx.fillStyle = df > 0.08
          ? `rgba(145, 180, 255, ${0.5 + df * 0.5})`
          : `rgba(100, 125, 230, 0.50)`
        ctx.fill()
        ctx.shadowBlur = 0
      }

      animRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize',     onResize)
      window.removeEventListener('mousemove',  onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      'fixed',
        top:           0,
        left:          0,
        width:         '100vw',
        height:        '100vh',
        zIndex:        0,
        pointerEvents: 'none',
        display:       'block',
      }}
    />
  )
}
