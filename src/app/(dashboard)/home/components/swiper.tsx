// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Badge from '@mui/material/Badge'

// Third-party Components
import classnames from 'classnames'
import { useKeenSlider } from 'keen-slider/react'

// Style Imports
import styles from './swiper.module.css'
import 'keen-slider/keen-slider.min.css'

interface SwiperControlsProps {
  images?: string[];
}

const SwiperControls = ({ images = [] }: SwiperControlsProps) => {
  // States
  const [loaded, setLoaded] = useState<boolean>(false)
  const [currentSlide, setCurrentSlide] = useState<number>(0)

  // Hooks
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true, // 启用循环
    mode: 'free-snap', // 使用自由快照模式，更好的滑动体验
    slides: {
      perView: 1, // 每次显示1张图片
      spacing: 0, // 图片间距
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    created() {
      setLoaded(true)
    },
    
    destroyed() {
      setLoaded(false)
    }
  })

  // 当图片列表变化时，重新初始化轮播图
  useEffect(() => {
    if (instanceRef.current && loaded) {
      instanceRef.current.update()
    }
  }, [images, loaded])

  // 如果没有图片，显示默认图片
  const displayImages = images.length > 0 ? images : [
    '/images/banners/1.jpg',
    '/images/banners/2.jpg',
    '/images/banners/3.jpg',
    '/images/banners/4.jpg',
    '/images/banners/5.jpg'
  ]

  // 获取实际的幻灯片数量（在循环模式下，实际数量是图片数量）
  const slidesCount = displayImages.length

  const handlePrev = () => {
    if (instanceRef.current) {
      instanceRef.current.prev()
    }
  }

  const handleNext = () => {
    if (instanceRef.current) {
      instanceRef.current.next()
    }
  }

  const handleDotClick = (idx: number) => {
    if (instanceRef.current) {
      instanceRef.current.moveToIdx(idx)
    }
  }

  return (
    <div className={styles['navigation-wrapper']}>
      <div ref={sliderRef} className="keen-slider">
        {displayImages.map((imageUrl, index) => (
          <div key={index} className="keen-slider__slide">
            <img 
              src={imageUrl} 
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error(`Failed to load image: ${imageUrl}`)
                // 可以设置一个默认图片
                e.currentTarget.src = '/images/banners/1.jpg'
              }}
            />
          </div>
        ))}
      </div>
      {loaded && instanceRef.current && slidesCount > 1 && (
        <>
          <i
            className={classnames('tabler-chevron-left', styles.arrow, styles['arrow-left'])}
            onClick={(e: any) => {
              e.stopPropagation()
              handlePrev()
            }}
          />

          <i
            className={classnames('tabler-chevron-right', styles.arrow, styles['arrow-right'])}
            onClick={(e: any) => {
              e.stopPropagation()
              handleNext()
            }}
          />
        </>
      )}
      {loaded && instanceRef.current && slidesCount > 1 && (
        <div className={styles['swiper-dots']}>
          {[...Array(slidesCount).keys()].map(idx => {
            return (
              <div
                key={idx}
                className={classnames(styles['swiper-dot'], {
                  [styles.active]: currentSlide === idx
                })}
                onClick={() => handleDotClick(idx)}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SwiperControls