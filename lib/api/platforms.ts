// External platform API integrations
export interface Product {
  id: string
  name: string
  price: number
  currency: string
  image: string
  images: string[]
  platform: string
  category: string
  availability: boolean
  externalUrl: string
  description?: string
  brand?: string
  specifications?: Record<string, string>
  rating?: number
  reviewCount?: number
  inStock?: number
}

export interface SearchParams {
  query: string
  category?: string
  platform?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
}

// Mock API responses for demonstration
// In production, these would be real API calls to each platform
export class PlatformAPI {
  private static async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private static getCategoriesForQuery(query: string): string[] {
    const lowerQuery = query.toLowerCase()

    // Map broad terms to specific categories
    if (lowerQuery.includes("electronics") || lowerQuery.includes("electronic")) {
      return ["smartphones", "laptops", "headphones"]
    }
    if (lowerQuery.includes("phone") || lowerQuery.includes("mobile")) {
      return ["smartphones"]
    }
    if (lowerQuery.includes("computer") || lowerQuery.includes("laptop")) {
      return ["laptops"]
    }
    if (lowerQuery.includes("audio") || lowerQuery.includes("headphone") || lowerQuery.includes("earphone")) {
      return ["headphones"]
    }

    return []
  }

  static async searchJumia(params: SearchParams): Promise<Product[]> {
    console.log("[enosx] Searching Jumia API with params:", params)

    // Simulate API call delay
    await this.delay(800)

    const mockProducts: Product[] = [
      {
        id: "jumia_1",
        name: "Samsung Galaxy A54 5G 128GB",
        price: 42000,
        currency: "KES",
        image: "/samsung-galaxy-a54-1.png",
        images: [
          "/samsung-galaxy-a54-1.png",
          "/samsung-galaxy-a54-2.png",
          "/samsung-galaxy-a54-3.png",
          "/samsung-galaxy-a54-4.png"
        ],
        platform: "jumia",
        category: "smartphones",
        availability: true,
        externalUrl: "https://jumia.co.ke/samsung-galaxy-a54",
        description: "Experience the power of 5G with Samsung Galaxy A54. Features a stunning 6.4-inch Super AMOLED display, versatile 50MP triple camera system, and all-day battery life.",
        brand: "Samsung",
        specifications: {
          "Display": "6.4-inch Super AMOLED, 2340x1080",
          "Processor": "Exynos 1380",
          "RAM": "8GB",
          "Storage": "128GB",
          "Camera": "50MP + 12MP + 5MP",
          "Battery": "5000mAh",
          "OS": "Android 13"
        },
        rating: 4.3,
        reviewCount: 1247,
        inStock: 15
      },
      {
        id: "jumia_2",
        name: "HP Pavilion 15 Laptop Intel Core i5",
        price: 85000,
        currency: "KES",
        image: "/hp-pavilion-laptop.png",
        images: [
          "/hp-pavilion-laptop.png",
          "/hp-pavilion-keyboard.png",
          "/hp-pavilion-ports.png",
          "/hp-pavilion-screen.png"
        ],
        platform: "jumia",
        category: "laptops",
        availability: true,
        externalUrl: "https://jumia.co.ke/hp-pavilion-15",
        description: "Powerful HP Pavilion 15 laptop perfect for work and entertainment. Features Intel Core i5 processor, 8GB RAM, and fast 512GB SSD storage.",
        brand: "HP",
        specifications: {
          "Display": "15.6-inch FHD (1920x1080)",
          "Processor": "Intel Core i5-1235U",
          "RAM": "8GB DDR4",
          "Storage": "512GB SSD",
          "Graphics": "Intel Iris Xe",
          "Battery": "Up to 8 hours",
          "Weight": "1.75kg"
        },
        rating: 4.5,
        reviewCount: 892,
        inStock: 8
      },
      {
        id: "jumia_3",
        name: "JBL Tune 760NC Wireless Headphones",
        price: 12500,
        currency: "KES",
        image: "/jbl-tune-760nc-headphones.png",
        images: [
          "/jbl-tune-760nc-headphones.png",
          "/jbl-tune-760nc-side.png",
          "/jbl-tune-760nc-controls.png",
          "/jbl-tune-760nc-case.png"
        ],
        platform: "jumia",
        category: "headphones",
        availability: true,
        externalUrl: "https://jumia.co.ke/jbl-tune-760nc",
        description: "Immerse yourself in JBL Pure Bass sound with active noise cancelling technology. Enjoy up to 35 hours of wireless listening.",
        brand: "JBL",
        specifications: {
          "Driver Size": "40mm",
          "Frequency Response": "20Hz - 20kHz",
          "Battery Life": "35 hours (ANC off), 30 hours (ANC on)",
          "Charging Time": "2 hours",
          "Connectivity": "Bluetooth 5.0",
          "Weight": "220g"
        },
        rating: 4.4,
        reviewCount: 634,
        inStock: 23
      },
      {
        id: "jumia_4",
        name: "Xiaomi Redmi Note 12 Pro 256GB",
        price: 38000,
        currency: "KES",
        image: "/xiaomi-redmi-note-12-pro-1.png",
        images: [
          "/xiaomi-redmi-note-12-pro-1.png",
          "/xiaomi-redmi-note-12-pro-2.png",
          "/xiaomi-redmi-note-12-pro-3.png",
          "/xiaomi-redmi-note-12-pro-4.png"
        ],
        platform: "jumia",
        category: "smartphones",
        availability: true,
        externalUrl: "https://jumia.co.ke/xiaomi-redmi-note-12-pro",
        description: "Capture life in stunning detail with the 108MP camera. Features a 6.67-inch AMOLED display and 67W fast charging.",
        brand: "Xiaomi",
        specifications: {
          "Display": "6.67-inch AMOLED, 2400x1080",
          "Processor": "MediaTek Dimensity 1080",
          "RAM": "8GB",
          "Storage": "256GB",
          "Camera": "108MP + 8MP + 2MP",
          "Battery": "5000mAh, 67W charging",
          "OS": "MIUI 14 (Android 13)"
        },
        rating: 4.2,
        reviewCount: 956,
        inStock: 12
      }
    ]

    return mockProducts.filter((product) => {
      const lowerQuery = params.query?.toLowerCase() || ""
      const broadCategories = this.getCategoriesForQuery(lowerQuery)

      const matchesQuery =
        !params.query ||
        product.name.toLowerCase().includes(lowerQuery) ||
        product.brand?.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery) ||
        broadCategories.includes(product.category)

      const matchesCategory = !params.category || params.category === "all" || product.category === params.category

      return matchesQuery && matchesCategory
    })
  }

  static async searchKilimall(params: SearchParams): Promise<Product[]> {
    console.log("[enosx] Searching Kilimall API with params:", params)

    await this.delay(1000)

    const mockProducts: Product[] = [
      {
        id: "kilimall_1",
        name: "iPhone 14 128GB Blue",
        price: 125000,
        currency: "KES",
        image: "/iphone-14-blue-1.png",
        images: [
          "/iphone-14-blue-1.png",
          "/iphone-14-blue-2.png",
          "/iphone-14-blue-3.png",
          "/iphone-14-blue-4.png"
        ],
        platform: "kilimall",
        category: "smartphones",
        availability: true,
        externalUrl: "https://kilimall.co.ke/iphone-14",
        description: "iPhone 14 with advanced dual-camera system, Crash Detection, and all-day battery life. Powered by the A15 Bionic chip.",
        brand: "Apple",
        specifications: {
          "Display": "6.1-inch Super Retina XDR",
          "Processor": "A15 Bionic chip",
          "RAM": "6GB",
          "Storage": "128GB",
          "Camera": "12MP + 12MP",
          "Battery": "Up to 20 hours video",
          "OS": "iOS 16"
        },
        rating: 4.7,
        reviewCount: 2341,
        inStock: 5
      },
      {
        id: "kilimall_2",
        name: "Lenovo ThinkPad E15 Gen 4",
        price: 95000,
        currency: "KES",
        image: "/lenovo-thinkpad-e15-1.png",
        images: [
          "/lenovo-thinkpad-e15-1.png",
          "/lenovo-thinkpad-e15-2.png",
          "/lenovo-thinkpad-e15-3.png",
          "/lenovo-thinkpad-e15-4.png"
        ],
        platform: "kilimall",
        category: "laptops",
        availability: true,
        externalUrl: "https://kilimall.co.ke/lenovo-thinkpad-e15",
        description: "Business-grade ThinkPad E15 with robust security features, excellent keyboard, and reliable performance for professionals.",
        brand: "Lenovo",
        specifications: {
          "Display": "15.6-inch FHD IPS",
          "Processor": "Intel Core i5-1235U",
          "RAM": "16GB DDR4",
          "Storage": "512GB SSD",
          "Graphics": "Intel Iris Xe",
          "Battery": "Up to 10 hours",
          "Weight": "1.7kg"
        },
        rating: 4.6,
        reviewCount: 567,
        inStock: 7
      },
      {
        id: "kilimall_3",
        name: "Sony WH-CH720N Noise Canceling",
        price: 18000,
        currency: "KES",
        image: "/sony-wh-ch720n-1.png",
        images: [
          "/sony-wh-ch720n-1.png",
          "/sony-wh-ch720n-2.png",
          "/sony-wh-ch720n-3.png",
          "/sony-wh-ch720n-4.png"
        ],
        platform: "kilimall",
        category: "headphones",
        availability: true,
        externalUrl: "https://kilimall.co.ke/sony-wh-ch720n",
        description: "Sony's advanced noise canceling technology meets exceptional sound quality. Features 35-hour battery life and quick charge.",
        brand: "Sony",
        specifications: {
          "Driver Size": "30mm",
          "Frequency Response": "7Hz - 20kHz",
          "Battery Life": "35 hours (NC on), 50 hours (NC off)",
          "Charging Time": "3 hours (10min = 1hr playback)",
          "Connectivity": "Bluetooth 5.2",
          "Weight": "192g"
        },
        rating: 4.5,
        reviewCount: 423,
        inStock: 18
      },
      {
        id: "kilimall_4",
        name: "MacBook Air M2 256GB",
        price: 165000,
        currency: "KES",
        image: "/macbook-air-m2-1.png",
        images: [
          "/macbook-air-m2-1.png",
          "/macbook-air-m2-2.png",
          "/macbook-air-m2-3.png",
          "/macbook-air-m2-4.png"
        ],
        platform: "kilimall",
        category: "laptops",
        availability: true,
        externalUrl: "https://kilimall.co.ke/macbook-air-m2",
        description: "Redesigned MacBook Air with M2 chip delivers incredible performance and up to 18 hours of battery life in a remarkably thin design.",
        brand: "Apple",
        specifications: {
          "Display": "13.6-inch Liquid Retina",
          "Processor": "Apple M2 chip",
          "RAM": "8GB unified memory",
          "Storage": "256GB SSD",
          "Graphics": "8-core GPU",
          "Battery": "Up to 18 hours",
          "Weight": "1.24kg"
        },
        rating: 4.8,
        reviewCount: 1876,
        inStock: 3
      }
    ]

    return mockProducts.filter((product) => {
      const lowerQuery = params.query?.toLowerCase() || ""
      const broadCategories = this.getCategoriesForQuery(lowerQuery)

      const matchesQuery =
        !params.query ||
        product.name.toLowerCase().includes(lowerQuery) ||
        product.brand?.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery) ||
        broadCategories.includes(product.category)

      const matchesCategory = !params.category || params.category === "all" || product.category === params.category

      return matchesQuery && matchesCategory
    })
  }

  static async searchJiji(params: SearchParams): Promise<Product[]> {
    console.log("[enosx] Searching Jiji API with params:", params)

    await this.delay(600)

    const mockProducts: Product[] = [
      {
        id: "jiji_1",
        name: "Tecno Spark 10 Pro 256GB",
        price: 28000,
        currency: "KES",
        image: "/tecno-spark-10-pro-1.png",
        images: [
          "/tecno-spark-10-pro-1.png",
          "/tecno-spark-10-pro-2.png",
          "/tecno-spark-10-pro-3.png",
          "/tecno-spark-10-pro-4.png"
        ],
        platform: "jiji",
        category: "smartphones",
        availability: true,
        externalUrl: "https://jiji.co.ke/tecno-spark-10-pro",
        description: "Affordable smartphone with impressive 6.8-inch display, 48MP AI camera, and long-lasting 5000mAh battery for all-day use.",
        brand: "Tecno",
        specifications: {
          "Display": "6.8-inch IPS LCD, 1640x720",
          "Processor": "MediaTek Helio G36",
          "RAM": "8GB (4GB + 4GB Extended)",
          "Storage": "256GB",
          "Camera": "48MP + 0.08MP + AI Lens",
          "Battery": "5000mAh",
          "OS": "HiOS 12.6 (Android 13)"
        },
        rating: 4.1,
        reviewCount: 789,
        inStock: 25
      },
      {
        id: "jiji_2",
        name: "Dell Inspiron 15 3000 Series",
        price: 65000,
        currency: "KES",
        image: "/dell-inspiron-15-1.png",
        images: [
          "/dell-inspiron-15-1.png",
          "/dell-inspiron-15-2.png",
          "/dell-inspiron-15-3.png",
          "/dell-inspiron-15-4.png"
        ],
        platform: "jiji",
        category: "laptops",
        availability: true,
        externalUrl: "https://jiji.co.ke/dell-inspiron-15",
        description: "Reliable Dell Inspiron 15 laptop perfect for students and everyday computing. Features essential performance at an affordable price.",
        brand: "Dell",
        specifications: {
          "Display": "15.6-inch HD (1366x768)",
          "Processor": "Intel Core i3-1115G4",
          "RAM": "4GB DDR4",
          "Storage": "1TB HDD",
          "Graphics": "Intel UHD Graphics",
          "Battery": "Up to 6 hours",
          "Weight": "2.2kg"
        },
        rating: 4.0,
        reviewCount: 345,
        inStock: 14
      },
      {
        id: "jiji_3",
        name: "Oraimo FreePods 3 Wireless Earbuds",
        price: 4500,
        currency: "KES",
        image: "/oraimo-freepods-3-1.png",
        images: [
          "/oraimo-freepods-3-1.png",
          "/oraimo-freepods-3-2.png",
          "/oraimo-freepods-3-3.png",
          "/oraimo-freepods-3-4.png"
        ],
        platform: "jiji",
        category: "headphones",
        availability: true,
        externalUrl: "https://jiji.co.ke/oraimo-freepods-3",
        description: "True wireless earbuds with superior sound quality and comfortable fit. Perfect for music, calls, and active lifestyle.",
        brand: "Oraimo",
        specifications: {
          "Driver Size": "13mm",
          "Frequency Response": "20Hz - 20kHz",
          "Battery Life": "6hrs + 19hrs (case)",
          "Charging Time": "1.5 hours",
          "Connectivity": "Bluetooth 5.0",
          "Water Resistance": "IPX4"
        },
        rating: 4.2,
        reviewCount: 1234,
        inStock: 45
      },
      {
        id: "jiji_4",
        name: "Infinix Note 12 Pro 256GB",
        price: 32000,
        currency: "KES",
        image: "/infinix-note-12-pro-1.png",
        images: [
          "/infinix-note-12-pro-1.png",
          "/infinix-note-12-pro-2.png",
          "/infinix-note-12-pro-3.png",
          "/infinix-note-12-pro-4.png"
        ],
        platform: "jiji",
        category: "smartphones",
        availability: true,
        externalUrl: "https://jiji.co.ke/infinix-note-12-pro",
        description: "Feature-packed smartphone with 108MP camera, 6.7-inch AMOLED display, and 33W fast charging for power users.",
        brand: "Infinix",
        specifications: {
          "Display": "6.7-inch AMOLED, 2400x1080",
          "Processor": "MediaTek Helio G99",
          "RAM": "8GB",
          "Storage": "256GB",
          "Camera": "108MP + 2MP + 0.08MP",
          "Battery": "5000mAh, 33W charging",
          "OS": "XOS 10.6 (Android 12)"
        },
        rating: 4.3,
        reviewCount: 678,
        inStock: 19
      }
    ]

    return mockProducts.filter((product) => {
      const lowerQuery = params.query?.toLowerCase() || ""
      const broadCategories = this.getCategoriesForQuery(lowerQuery)

      const matchesQuery =
        !params.query ||
        product.name.toLowerCase().includes(lowerQuery) ||
        product.brand?.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery) ||
        broadCategories.includes(product.category)

      const matchesCategory = !params.category || params.category === "all" || product.category === params.category

      return matchesQuery && matchesCategory
    })
  }

  static async searchAllPlatforms(params: SearchParams): Promise<Product[]> {
    console.log("[enosx] Searching all platforms with params:", params)

    try {
      // Search all platforms in parallel
      const [jumiaResults, kilimallResults, jijiResults] = await Promise.allSettled([
        this.searchJumia(params),
        this.searchKilimall(params),
        this.searchJiji(params),
      ])

      const allProducts: Product[] = []

      // Collect successful results
      if (jumiaResults.status === "fulfilled") {
        allProducts.push(...jumiaResults.value)
      } else {
        console.error("[enosx] Jumia API error:", jumiaResults.reason)
      }

      if (kilimallResults.status === "fulfilled") {
        allProducts.push(...kilimallResults.value)
      } else {
        console.error("[enosx] Kilimall API error:", kilimallResults.reason)
      }

      if (jijiResults.status === "fulfilled") {
        allProducts.push(...jijiResults.value)
      } else {
        console.error("[enosx] Jiji API error:", jijiResults.reason)
      }

      // Sort by price (ascending)
      return allProducts.sort((a, b) => a.price - b.price)
    } catch (error) {
      console.error("[enosx] Error searching platforms:", error)
      return []
    }
  }
}
