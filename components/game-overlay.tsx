"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  Users,
  DollarSign,
  Award,
  Shield,
  Gavel,
  Building,
  Heart,
  Cpu,
  Zap,
  Info,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Globe,
  ZoomIn,
  ZoomOut,
  Move,
} from "lucide-react"

// Define types for city data
interface CityData {
  Sector: string
  CountryCode: string
  CultureCode: string
  CityName: string
  Country: string
  Population: string
  PopulationRating: string
  PopulationType: string
  CityType1: string
  CityType2: string
  CityType3: string
  CityType4: string
  HVT: string
  CrimeIndex: string
  SafetyIndex: string
  CityBonus: string
}

// Define types for country data
interface CountryData {
  "Country Code": string
  Country: string
  President: string
  Population: string
  PopulationRating: string
  Motto: string
  Nationalities: string
  GovernmentStructureType: string
  GovernmentPreception: string
  GovermentCorruption: string
  PresidentialTerm: string
  LeaderTitleType: string
  MilitaryServices: string
  MilitaryBudget: string
  IntelligenceServices: string
  IntelligenceBudget: string
  CapitalPunishmentType: string
  MediaFreedom: string
  LawEnforcement: string
  LawEnforcementBudget: string
  GDPNational: string
  GDPPerCaptia: string
  Healthcare: string
  HigherEducation: string
  SocialDevopment: string
  Lifestyle: string
  TerrorismActivity: string
  CyberCapabilities: string
  DigitalDevelopment: string
  Science: string
  Cloning: string
  LSWActivity: string
  LSWRegulations: string
  Vigilantism: string
  Gender: string
}

export default function GameOverlay() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showCountryList, setShowCountryList] = useState(false)
  const [currentCountry, setCurrentCountry] = useState("India")
  const [cityData, setCityData] = useState<CityData[]>([])
  const [countryData, setCountryData] = useState<CountryData[]>([])
  const [currentCountryData, setCurrentCountryData] = useState<CountryData | null>(null)
  const [filteredCities, setFilteredCities] = useState<CityData[]>([])
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [countries, setCountries] = useState<string[]>([])

  // Map panning state
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const mapRef = useRef<HTMLDivElement>(null)

  // Fetch city and country data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch city data
        const cityResponse = await fetch(
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SuperHero%20Tactics%20World%20Bible%20-%20Cities-8WNLUlBf6erIfOxT9iNtoFa81FcLYj.csv",
        )
        const cityText = await cityResponse.text()

        // Parse city CSV
        const cityRows = cityText.split("\n")
        const cityHeaders = cityRows[0].split(",")

        const parsedCityData: CityData[] = []

        for (let i = 1; i < cityRows.length; i++) {
          if (cityRows[i].trim() === "") continue

          const values = cityRows[i].split(",")
          const city: any = {}

          cityHeaders.forEach((header, index) => {
            if (header === "") {
              city["CityBonus"] = values[index] || ""
            } else {
              city[header] = values[index] || ""
            }
          })

          parsedCityData.push(city as CityData)
        }

        setCityData(parsedCityData)

        // Fetch country data
        const countryResponse = await fetch(
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SuperHero%20Tactics%20World%20Bible%20-%20Country-80xkskchNCwKlKKbK1HRKSxGpzs5ja.csv",
        )
        const countryText = await countryResponse.text()

        // Parse country CSV
        const countryRows = countryText.split("\n")
        const countryHeaders = countryRows[0].split(",")

        const parsedCountryData: CountryData[] = []

        for (let i = 1; i < countryRows.length; i++) {
          if (countryRows[i].trim() === "") continue

          const values = countryRows[i].split(",")
          const country: any = {}

          countryHeaders.forEach((header, index) => {
            country[header] = values[index] || ""
          })

          parsedCountryData.push(country as CountryData)
        }

        setCountryData(parsedCountryData)

        // Extract unique countries from the city CSV data
        const uniqueCountries = Array.from(new Set(parsedCityData.map((city) => city.Country)))
          .filter(Boolean)
          .sort()
        setCountries(uniqueCountries)

        // Set initial country to India
        const indiaData = parsedCountryData.find((country) => country.Country === "India") || null
        setCurrentCountryData(indiaData)

        // Filter cities for India initially
        const indianCities = parsedCityData.filter((city) => city.Country === "India")
        setFilteredCities(indianCities)

        if (indianCities.length > 0) {
          setSelectedCity(indianCities[0])
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Map dragging handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return // Only left mouse button
    setIsDragging(true)
    setDragStart({ x: e.clientX - mapPosition.x, y: e.clientY - mapPosition.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const newX = e.clientX - dragStart.x
    const newY = e.clientY - dragStart.y
    setMapPosition({ x: newX, y: newY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 2.5))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5))
  }

  const filteredCountries = countries.filter((country) => country.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setShowCountryList(e.target.value.length > 0)
  }

  const handleCountrySelect = (country) => {
    setSearchTerm("")
    setShowCountryList(false)
    setCurrentCountry(country)

    // Set current country data
    const selectedCountryData = countryData.find((c) => c.Country === country) || null
    setCurrentCountryData(selectedCountryData)

    // Filter cities for the selected country
    const countryCities = cityData.filter((city) => city.Country === country)
    setFilteredCities(countryCities)

    if (countryCities.length > 0) {
      setSelectedCity(countryCities[0])
    } else {
      setSelectedCity(null)
    }
  }

  const handleCitySelect = (city: CityData) => {
    setSelectedCity(city)
  }

  const navigateCountry = (direction: "next" | "prev") => {
    const currentIndex = countries.indexOf(currentCountry)
    let newIndex

    if (direction === "next") {
      newIndex = (currentIndex + 1) % countries.length
    } else {
      newIndex = (currentIndex - 1 + countries.length) % countries.length
    }

    handleCountrySelect(countries[newIndex])
  }

  // Helper function to render rating bars
  const renderRatingBars = (value: string, color: string) => {
    const numValue = Number.parseInt(value, 10)
    const maxRating = 100
    const numBars = 5
    const filledBars = Math.ceil((numValue / maxRating) * numBars)

    return (
      <div className="flex space-x-1">
        {Array.from({ length: numBars }).map((_, i) => (
          <div
            key={i}
            className={`w-6 h-6 ${i < filledBars ? `bg-${color}-600 border border-${color}-800` : "bg-gray-800 border border-gray-700"} shadow-md flex items-center justify-center font-bold ${i < filledBars ? "" : "text-gray-500"}`}
          >
            {i + 1}
          </div>
        ))}
      </div>
    )
  }

  // Helper function to get rating text
  const getRatingText = (value: string) => {
    const numValue = Number.parseInt(value, 10)
    if (numValue >= 90) return "EX-HIGH"
    if (numValue >= 70) return "V-HIGH"
    if (numValue >= 50) return "HIGH"
    if (numValue >= 30) return "MED"
    if (numValue >= 10) return "LOW"
    return "V-LOW"
  }

  // Helper function to get rating color
  const getRatingColor = (value: string) => {
    const numValue = Number.parseInt(value, 10)
    if (numValue >= 70) return "text-blue-400"
    if (numValue >= 50) return "text-green-400"
    if (numValue >= 30) return "text-yellow-400"
    if (numValue >= 10) return "text-orange-400"
    return "text-red-400"
  }

  // City type icons mapping
  const cityTypeIcons = {
    Industrial: "🏭",
    Educational: "🏫",
    Mining: "⛏️",
    Political: "🏛️",
    Agricultural: "🌾",
    Commercial: "🏪",
    Financial: "💰",
    Military: "🪖",
    Technological: "💻",
    Tourism: "🏖️",
    Religious: "⛪",
    Cultural: "🎭",
    Transportation: "🚂",
    Residential: "🏘️",
    Medical: "🏥",
    Entertainment: "🎬",
    Sports: "⚽",
    Research: "🔬",
    Resort: "🌴",
    Temple: "🛕",
    Port: "🚢",
    Fishing: "🎣",
    Historical: "🏺",
    Diplomatic: "🤝",
    Artistic: "🎨",
    Fortress: "🏰",
    Market: "🛒",
    University: "🎓",
    Space: "🚀",
    Nuclear: "☢️",
    Luxury: "💎",
    Slum: "🏚️",
    Prison: "🔒",
    Casino: "🎰",
    Ruins: "🗿",
    Underwater: "🌊",
    Desert: "🏜️",
    Arctic: "❄️",
    Jungle: "🌿",
    Mountain: "⛰️",
    Island: "🏝️",
  }

  // Get icon for city type
  const getCityTypeIcon = (type: string) => {
    return cityTypeIcons[type] || "🏙️"
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden text-white font-medium">
      {/* World Map Background */}
      <div
        ref={mapRef}
        className="absolute inset-0 z-0 cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="absolute"
          style={{
            transform: `translate(${mapPosition.x}px, ${mapPosition.y}px) scale(${zoom})`,
            transformOrigin: "center",
            transition: isDragging ? "none" : "transform 0.1s ease-out",
          }}
        >
          {/* World Map SVG */}
          <svg width="2000" height="1000" viewBox="0 0 2000 1000" className="opacity-70">
            <g fill="#1e3a8a" stroke="#2563eb" strokeWidth="1">
              {/* Simplified world map paths */}
              <path d="M781.68,324.4l-2.31,8.68l-12.53,4.23l-3.75-4.4l-1.82,0.5l3.4,13.12l5.09,0.57l6.79,2.57v2.57l3.11-0.57l4.53-6.27v-2.57l2.55-3.4h1.7l5.39,0.57l5.68-0.57l3.96-3.4l1.98-0.57l0.85,1.13l1.13-1.7l1.56-0.28l3.4-3.68l0.85-3.68l-1.56-0.85l-3.96,0.57l-1.7-1.13h-2.83l-0.85-10.81l-0.85-2.83l-3.4,1.13l-0.28-1.13l-1.56-2.26h-5.09l-0.56-2.26l-5.39-0.28l-3.96,1.98l-4.81-1.98l-1.56-2.83h-1.98l-2.55,1.7l-1.39,2.96L781.68,324.4z" />
              <path d="M137.49,225.43l4.67,1.3l0.33,2.93l2.17,1.63l2.17-1.63l2.5,0.98l3.26-0.33l0.33,3.26l3.91,0.33l3.26-4.89l1.63-4.89l1.3-0.98l-1.63-2.28l-1.63-1.3l-3.91-1.3l-1.96,0.33l-2.5-0.98l-0.98,1.3l-0.98-0.33l-1.63,1.63l-0.33,2.61l-3.26,1.3l-3.26-0.33l-3.26-3.26l-0.33-2.93h-1.3l-0.65,1.3l-1.3,0.33l-0.33,4.89l-1.96,1.3L137.49,225.43z" />
              <path d="M814.17,341.22l-1.65,2.36l0.94,1.65l-0.24,1.88l-4.01,2.36l-0.94,1.41l-3.54,1.18l-2.83,0.24l-1.65,1.88l-2.36,0.71l-1.18,0.24l-0.94-1.18l-1.89-0.24l0.24-1.18l-2.36-1.88l-2.95,0.94l-1.89,1.18l-0.94,1.18l-1.65-0.24l-2.36-1.18l-2.95,0.94l-2.83-0.24l-2.36,1.18l-2.36-0.71l0.24-2.36l1.18-0.94l-0.94-4.25l-2.36-0.94l-1.18-2.36l1.18-3.54l1.18-0.94l3.3,0.24l1.18-1.18l3.54,0.24l3.54-1.18l1.18,0.71l1.41-0.71l1.41,0.71l2.36-0.94l1.65-1.41l2.36-0.24l0.94-1.18l4.72-0.24l0.94-1.18l2.36,0.24l3.07,0.94l1.18,1.41l4.01,0.47l2.07,1.18l1.18,2.12L814.17,341.22z" />
              <path d="M551.03,363.46l-1.74,3.87l0.39,0.97l2.32,1.74l2.32-1.74l3.09,0.39l1.74-1.16l2.9,0.39l0.39,1.74l2.32,0.58l0.97-1.16l1.74,0.97l2.51-2.51l4.25-1.55l2.32-1.74l2.9,1.16l3.48,0.39l1.74,1.55l0.97-0.39l1.16-0.97l-0.39-1.55l1.74-0.97l0.39-2.32l-0.58-2.51l-3.48-3.48l-2.51-2.32l-2.32-0.39l-1.74,0.97l-2.9-0.77l-2.32,0.97l-0.97-1.55l-2.51-0.39l-3.87,0.39l-3.48,0.97l-2.32,1.74l-2.51-0.39l-2.9,1.55l-1.74,2.32l-2.32,1.16L551.03,363.46z" />
              <path d="M722.48,307.09l-0.62,1.73l-0.62,2.24l-2.8,1.62l-4.85,1.12l-2.8-0.5l-2.8-0.87l-1.5,1.87l0.25,1.12l3.92,0.5l0.25,0.5l-1.5,0.87l-0.25,1.12l-4.29-0.37l-2.05,0.87l-2.92,0.87l-1.55,2.24l-0.93,1.12l-1.67-0.87l-2.05,0.87l-1.55-1.24l-1.24,0.5l-3.17-0.5l-3.42,0.87l-2.3,1.74l-2.55,1.12l-0.31,1.74l1.24,1.87l1.24,1.12l-0.93,1.62l-1.8,0.5l-0.25,1.24l-1.24-0.5l-1.8-1.87l-2.55-0.87l-1.24-1.24l0.93-1.37l3.79-1.37l0.25-0.5l-2.3-1.24l-1.55-1.87l-0.93-1.24l-2.8-1.62l-2.55,0.5l-2.55,1.24l-2.67,1.87l-1.55-0.87l-0.25-1.87l1.8-1.5l2.05-0.87l0.93-1.24l1.98-0.87l-1.86-1.62l-1.8-1.5v-1.74l3.04-1.5l5.59-1.24l5.59-2.11l4.47-0.5l3.04,0.5l1.8-1.24l1.55-0.5l0.56-1.99l4.91-1.62l2.3-1.87h1.55l2.92,1.87l1.55,0.5l2.55-0.5l4.1,0.5l3.73,1.87l3.42,0.87L722.48,307.09z" />
              <path d="M691.92,304.49l1.25,1.5l-0.25,2l-2.25,2l-0.25,1.25l-4.75-1.25l-4,1.25l-1.5-0.25l-2.75,3l-0.25,2.5l-3.25,2.5l-3,1l-2.5-1l-2.25-1l-3.25,0.25l-1.75-1.25l-1.25-2.25l-1.25-1.5v-2l0.5-2l1-0.25l-0.25-1.75l0.75-2.75l2.5,0.25l1.5-1.25l3.5-1.25l1.75,0.5l2.75-0.25l3.5-1.25l2.75-2l2-0.25l2.25-0.75l3.5,0.5l3.75,1.75L691.92,304.49z" />
              <path d="M258.94,453.82l1.96-0.13l1.96,1.96l0.65,2.61l1.31,0.65l0.65,1.31l-1.31,0.65l-0.65,1.31l0.65,1.31l-0.65,1.31l-1.31-1.31l-1.31,0.65l-1.31-0.65l-1.31,1.31l-0.65-1.31l-1.96-0.65l-1.31-1.31l0.65-1.31l-0.65-2.61l0.65-1.31L258.94,453.82z" />
              <path d="M309.95,266.44l-0.69,2.61l2.29,2.75l-0.46,1.38l-3.2,1.15l-0.46,1.38l2.52,2.29l4.81,1.38l1.38-0.46l1.38,1.38l-0.46,1.83l-2.29,0.92l-0.46,1.38l1.38,1.38l-2.75,2.52l-2.75,1.15l-1.83-0.46l-2.29-1.83l-4.58-1.38l-0.46-2.29l1.38-1.38l-0.46-1.38l-2.75-0.46l-1.38-2.29l-1.83-1.83l0.46-1.83l1.83-1.83l-0.46-1.38l2.29-2.75l2.29-0.46l1.38-1.38l3.2-1.15l2.29,0.46l2.29,1.15l0.46,1.38L309.95,266.44z" />
              <path d="M825.74,496.34l-1.96,1.11l-2.51-0.74l-0.74-1.85l0.74-1.48h3.33l1.48,1.11L825.74,496.34z" />
              <path d="M830.99,397.52l-2.63,2.63l-2.63-0.88l-0.88-2.63l1.75-1.75l2.63,0.88L830.99,397.52z" />
              <path d="M834.34,324.28l-3.6,0.26l-2.06,2.06l-2.31-0.77l-2.31,1.03l-2.31-0.26l-1.03-1.29l-2.57-0.77l-2.83,0.26l-2.31,1.8l-2.83,0.77l-0.77,1.29l2.57,2.31l1.8,2.31l2.06-0.77l2.31,0.26l2.31-1.29l3.09,0.26l1.29,1.29l3.34-0.26l1.8,1.03l1.29-0.77l0.26-2.83l2.06-1.29l-1.29-2.06l-2.83-1.8l-1.29-2.06L834.34,324.28z" />
              <path d="M360.47,383.28l-0.5,2.14l-1.64,1.14l-2.14-0.5l-1.64,1.14l-1.64-0.5l-1.64-1.64l-0.5-2.14l1.14-1.64l1.64,0.5l1.14-1.14l1.14,0.5l1.64-0.5l0.5,1.64L360.47,383.28z" />
              <path d="M480.63,378.14l-2.5-0.5l-1-1.5l0.5-1.5l2-1l2,0.5l1,1.5L480.63,378.14z" />
              <path d="M504.13,390.64l-1.5-0.5l-1-1.5l1-1.5l1.5-0.5l1.5,1l0.5,1.5L504.13,390.64z" />
              <path d="M487.13,368.64l-1.5,1l-1.5-1l-0.5-1.5l1-1.5l1.5,0.5l1,1.5L487.13,368.64z" />
              <path d="M488.13,374.14l-1,1.5l-1.5-0.5l-1-1.5l0.5-1.5l1.5-0.5l1.5,1L488.13,374.14z" />
              <path d="M489.63,379.64l-1.5,1l-1.5-0.5l-0.5-1.5l1-1.5l1.5,0.5l1,1.5L489.63,379.64z" />
              <path d="M494.63,375.64l-1.5,1l-1.5-1l-0.5-1.5l1-1.5l1.5,0.5l1,1.5L494.63,375.64z" />
              <path d="M497.63,381.14l-1.5,1l-1.5-0.5l-0.5-1.5l1-1.5l1.5,0.5l1,1.5L497.63,381.14z" />
              <path d="M500.63,386.64l-1.5,0.5l-1-1l0.5-1.5l1-1l1.5,0.5l0.5,1.5L500.63,386.64z" />
              <path d="M507.13,394.64l-1.5,1l-1.5-0.5l-0.5-1.5l1-1.5l1.5,0.5l1,1.5L507.13,394.64z" />
              <path d="M508.63,399.14l-1,1.5l-1.5-0.5l-1-1.5l0.5-1.5l1.5-0.5l1.5,1L508.63,399.14z" />
              <path d="M516.13,399.14l-1.5,1l-1.5-0.5l-0.5-1.5l1-1.5l1.5,0.5l1,1.5L516.13,399.14z" />
              <path d="M516.13,402.64l-1,1.5l-1.5-0.5l-1-1.5l0.5-1.5l1.5-0.5l1.5,1L516.13,402.64z" />
              <path d="M519.13,405.64l-1,1.5l-1.5-0.5l-1-1.5l0.5-1.5l1.5-0.5l1.5,1L519.13,405.64z" />
              <path d="M522.13,408.64l-1,1.5l-1.5-0.5l-1-1.5l0.5-1.5l1.5-0.5l1.5,1L522.13,408.64z" />
              <path d="M525.13,411.64l-1,1.5l-1.5-0.5l-1-1.5l0.5-1.5l1.5-0.5l1.5,1L525.13,411.64z" />
              <path d="M528.13,414.64l-1,1.5l-1.5-0.5l-1-1.5l0.5-1.5l1.5-0.5l1.5,1L528.13,414.64z" />
              <path d="M531.13,417.64l-1,1.5l-1.5-0.5l-1-1.5l0.5-1.5l1.5-0.5l1.5,1L531.13,417.64z" />
            </g>
          </svg>
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-20 right-20 z-30 flex flex-col space-y-2">
        <button className="bg-blue-800 hover:bg-blue-700 p-2 rounded-full shadow-lg" onClick={handleZoomIn}>
          <ZoomIn className="w-6 h-6 text-white" />
        </button>
        <button className="bg-blue-800 hover:bg-blue-700 p-2 rounded-full shadow-lg" onClick={handleZoomOut}>
          <ZoomOut className="w-6 h-6 text-white" />
        </button>
        <button
          className="bg-blue-800 hover:bg-blue-700 p-2 rounded-full shadow-lg"
          onClick={() => setMapPosition({ x: 0, y: 0 })}
        >
          <Move className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Top section - Partners and Adversaries */}
      <div className="absolute top-2 right-2 z-20 flex space-x-2">
        <div className="bg-blue-900 bg-opacity-90 rounded border border-blue-700 p-2">
          <h3 className="text-xs font-bold mb-1 text-blue-300">PARTNERS</h3>
          <div className="flex space-x-1">
            <div className="w-8 h-6 bg-[url('/placeholder.svg?height=24&width=32')] bg-center bg-no-repeat bg-contain"></div>
            <div className="w-8 h-6 bg-[url('/placeholder.svg?height=24&width=32')] bg-center bg-no-repeat bg-contain"></div>
          </div>
        </div>
        <div className="bg-red-900 bg-opacity-90 rounded border border-red-700 p-2">
          <h3 className="text-xs font-bold mb-1 text-red-300">ADVERSARIES</h3>
          <div className="flex space-x-1">
            <div className="w-8 h-6 bg-[url('/placeholder.svg?height=24&width=32')] bg-center bg-no-repeat bg-contain"></div>
            <div className="w-8 h-6 bg-[url('/placeholder.svg?height=24&width=32')] bg-center bg-no-repeat bg-contain"></div>
          </div>
        </div>
      </div>

      {/* Left side panels */}
      <div className="absolute top-2 left-0 z-10 w-72 space-y-2 p-2">
        {/* Government panel */}
        <div className="bg-blue-900 bg-opacity-90 rounded border border-blue-700">
          <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white p-1 font-bold text-lg flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            GOVERNMENT
          </div>

          {/* Country flag and name */}
          <div className="p-2 flex">
            <div className="w-28 h-20 bg-gradient-to-b from-orange-500 via-white to-green-500 rounded border border-gray-700 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center">
                <span className="text-lg">🇮🇳</span>
              </div>
            </div>
            <div className="ml-3">
              <h2 className="text-2xl font-bold text-white">{currentCountry.toUpperCase()}</h2>
              <p className="text-sm italic text-gray-300">{currentCountryData?.Motto || "Truth Alone Triumphs"}</p>
              <p className="text-xs text-blue-300 mt-1">
                {currentCountryData?.LeaderTitleType || "President"}: {currentCountryData?.President || "Unknown"}
              </p>
            </div>
          </div>

          {/* Population and Funding */}
          <div className="p-2 space-y-2 border-t border-blue-700">
            <div className="flex items-center text-white text-sm">
              <Users className="w-5 h-5 mr-2 text-blue-300" />
              <span className="font-bold">
                Population:{" "}
                <span className="text-yellow-300">
                  {currentCountryData?.Population
                    ? Number.parseInt(currentCountryData.Population).toLocaleString()
                    : "Unknown"}
                </span>
              </span>
            </div>
            <div className="flex items-center text-white text-sm">
              <DollarSign className="w-5 h-5 mr-2 text-green-300" />
              <span className="font-bold">
                Funding: <span className="text-green-300">$260,000</span>
              </span>
            </div>
          </div>

          {/* Government details */}
          <div className="p-2 space-y-2 border-t border-blue-700">
            <div className="flex items-center text-white text-sm">
              <span className="font-bold mr-2 w-24">Structure:</span>
              <span className="text-yellow-300">
                {currentCountryData?.GovernmentStructureType || "Constitutional Monarchy"}
              </span>
            </div>
            <div className="flex items-center text-white text-sm">
              <span className="font-bold mr-2 w-24">Perception:</span>
              <span className="text-yellow-300">
                {currentCountryData?.GovernmentPreception || "Authoritarian Regime"}
              </span>
            </div>
            <div className="flex flex-col text-white text-sm">
              <div className="flex justify-between">
                <span className="font-bold">Government Corruption:</span>
                <span
                  className={getRatingColor(currentCountryData?.GovermentCorruption || "80")}
                  style={{ minWidth: "70px", textAlign: "right" }}
                >
                  {getRatingText(currentCountryData?.GovermentCorruption || "80")}
                </span>
              </div>
              <div className="flex space-x-1 mt-1">
                {renderRatingBars(currentCountryData?.GovermentCorruption || "80", "red")}
              </div>
            </div>
          </div>
        </div>

        {/* Laws panel */}
        <div className="bg-blue-900 bg-opacity-90 rounded border border-blue-700">
          <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white p-1 font-bold text-lg flex items-center">
            <Gavel className="w-5 h-5 mr-2" />
            LAWS
          </div>

          <div className="p-2 grid grid-cols-1 gap-2">
            <div className="flex items-center text-white text-sm">
              <Shield className="w-5 h-5 mr-1 text-blue-300" />
              <span>Vigilantism</span>
              <div className="ml-auto w-6 h-6 bg-green-600 rounded-md border border-green-800 shadow-md flex items-center justify-center">
                {currentCountryData?.Vigilantism === "Banned" ? "✗" : "✓"}
              </div>
            </div>
            <div className="flex items-center text-white text-sm">
              <Gavel className="w-5 h-5 mr-1 text-red-300" />
              <span>Capital Punishment</span>
              <div className="ml-auto w-6 h-6 bg-red-600 rounded-md border border-red-800 shadow-md flex items-center justify-center">
                {currentCountryData?.CapitalPunishmentType === "Inactive" ? "✗" : "✓"}
              </div>
            </div>
            <div className="flex items-center text-white text-sm">
              <Zap className="w-5 h-5 mr-1 text-yellow-300" />
              <span>Superweapons</span>
              <div className="ml-auto w-6 h-6 bg-green-600 rounded-md border border-green-800 shadow-md flex items-center justify-center">
                {currentCountryData?.LSWRegulations === "Banned" ? "✗" : "✓"}
              </div>
            </div>
            <div className="flex items-center text-white text-sm">
              <Cpu className="w-5 h-5 mr-1 text-purple-300" />
              <span>Cloning</span>
              <div className="ml-auto w-6 h-6 bg-yellow-600 rounded-md border border-yellow-800 shadow-md flex items-center justify-center">
                {currentCountryData?.Cloning === "Banned"
                  ? "✗"
                  : currentCountryData?.Cloning === "Regulated"
                    ? "?"
                    : "✓"}
              </div>
            </div>
            <div className="flex items-center text-white text-sm">
              <AlertTriangle className="w-5 h-5 mr-1 text-orange-300" />
              <span>Terrorism Activity</span>
              <div className="ml-auto w-6 h-6 bg-red-600 rounded-md border border-red-800 shadow-md flex items-center justify-center">
                {Number.parseInt(currentCountryData?.TerrorismActivity || "0") > 30 ? "✓" : "✗"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side panels */}
      <div className="absolute top-2 right-0 z-10 w-72 space-y-2 p-2 mt-16">
        {/* Liberties & Economics */}
        <div className="bg-blue-900 bg-opacity-90 rounded border border-blue-700">
          <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white p-1 font-bold text-lg flex items-center">
            <Award className="w-5 h-5 mr-2" />
            LIBERTIES & ECONOMICS
          </div>

          <div className="p-2 space-y-2">
            <div className="grid grid-cols-12 items-center text-white text-sm">
              <span className="font-bold col-span-3">Liberty:</span>
              <div className="flex space-x-1 col-span-6">
                {renderRatingBars(currentCountryData?.MediaFreedom || "60", "green")}
              </div>
              <span
                className={`col-span-3 ${getRatingColor(currentCountryData?.MediaFreedom || "60")} font-bold text-right`}
              >
                {getRatingText(currentCountryData?.MediaFreedom || "60")}
              </span>
            </div>

            <div className="grid grid-cols-12 items-center text-white text-sm">
              <span className="font-bold col-span-3">Education:</span>
              <div className="flex space-x-1 col-span-6">
                {renderRatingBars(currentCountryData?.HigherEducation || "80", "blue")}
              </div>
              <span
                className={`col-span-3 ${getRatingColor(currentCountryData?.HigherEducation || "80")} font-bold text-right`}
              >
                {getRatingText(currentCountryData?.HigherEducation || "80")}
              </span>
            </div>

            <div className="grid grid-cols-12 items-center text-white text-sm">
              <span className="font-bold col-span-3">Military:</span>
              <div className="flex space-x-1 col-span-6">
                {renderRatingBars(currentCountryData?.MilitaryServices || "20", "red")}
              </div>
              <span
                className={`col-span-3 ${getRatingColor(currentCountryData?.MilitaryServices || "20")} font-bold text-right`}
              >
                {getRatingText(currentCountryData?.MilitaryServices || "20")}
              </span>
            </div>

            <div className="grid grid-cols-12 items-center text-white text-sm">
              <span className="font-bold col-span-3">Intelligence:</span>
              <div className="flex space-x-1 col-span-6">
                {renderRatingBars(currentCountryData?.IntelligenceServices || "40", "orange")}
              </div>
              <span
                className={`col-span-3 ${getRatingColor(currentCountryData?.IntelligenceServices || "40")} font-bold text-right`}
              >
                {getRatingText(currentCountryData?.IntelligenceServices || "40")}
              </span>
            </div>

            <div className="grid grid-cols-12 items-center text-white text-sm">
              <span className="font-bold col-span-3">Wealth:</span>
              <div className="flex space-x-1 col-span-6">
                {renderRatingBars(currentCountryData?.GDPNational || "80", "yellow")}
              </div>
              <span
                className={`col-span-3 ${getRatingColor(currentCountryData?.GDPNational || "80")} font-bold text-right`}
              >
                {getRatingText(currentCountryData?.GDPNational || "80")}
              </span>
            </div>
          </div>
        </div>

        {/* Health & Science */}
        <div className="bg-blue-900 bg-opacity-90 rounded border border-blue-700">
          <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white p-1 font-bold text-lg flex items-center">
            <Heart className="w-5 h-5 mr-2" />
            HEALTH & SCIENCE
          </div>

          <div className="p-2 space-y-2">
            <div className="grid grid-cols-12 items-center text-white text-sm">
              <span className="font-bold col-span-3">Healthcare:</span>
              <div className="flex space-x-1 col-span-6">
                {renderRatingBars(currentCountryData?.Healthcare || "60", "green")}
              </div>
              <span
                className={`col-span-3 ${getRatingColor(currentCountryData?.Healthcare || "60")} font-bold text-right`}
              >
                {getRatingText(currentCountryData?.Healthcare || "60")}
              </span>
            </div>

            <div className="grid grid-cols-12 items-center text-white text-sm">
              <span className="font-bold col-span-3">Science:</span>
              <div className="flex space-x-1 col-span-6">
                {renderRatingBars(currentCountryData?.Science || "60", "blue")}
              </div>
              <span
                className={`col-span-3 ${getRatingColor(currentCountryData?.Science || "60")} font-bold text-right`}
              >
                {getRatingText(currentCountryData?.Science || "60")}
              </span>
            </div>

            <div className="grid grid-cols-12 items-center text-white text-sm">
              <span className="font-bold col-span-3">Cyber:</span>
              <div className="flex space-x-1 col-span-6">
                {renderRatingBars(currentCountryData?.CyberCapabilities || "80", "purple")}
              </div>
              <span
                className={`col-span-3 ${getRatingColor(currentCountryData?.CyberCapabilities || "80")} font-bold text-right`}
              >
                {getRatingText(currentCountryData?.CyberCapabilities || "80")}
              </span>
            </div>

            <div className="grid grid-cols-12 items-center text-white text-sm">
              <span className="font-bold col-span-3">Digital:</span>
              <div className="flex space-x-1 col-span-6">
                {renderRatingBars(currentCountryData?.DigitalDevelopment || "100", "blue")}
              </div>
              <span
                className={`col-span-3 ${getRatingColor(currentCountryData?.DigitalDevelopment || "100")} font-bold text-right`}
              >
                {getRatingText(currentCountryData?.DigitalDevelopment || "100")}
              </span>
            </div>
          </div>
        </div>

        {/* Social & Development */}
        <div className="bg-blue-900 bg-opacity-90 rounded border border-blue-700">
          <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white p-1 font-bold text-lg flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            SOCIAL & DEVELOPMENT
          </div>

          <div className="p-2 space-y-2">
            <div className="grid grid-cols-12 items-center text-white text-sm">
              <span className="font-bold col-span-3">Social:</span>
              <div className="flex space-x-1 col-span-6">
                {renderRatingBars(currentCountryData?.SocialDevopment || "60", "green")}
              </div>
              <span
                className={`col-span-3 ${getRatingColor(currentCountryData?.SocialDevopment || "60")} font-bold text-right`}
              >
                {getRatingText(currentCountryData?.SocialDevopment || "60")}
              </span>
            </div>

            <div className="grid grid-cols-12 items-center text-white text-sm">
              <span className="font-bold col-span-3">Lifestyle:</span>
              <div className="flex space-x-1 col-span-6">
                {renderRatingBars(currentCountryData?.Lifestyle || "70", "blue")}
              </div>
              <span
                className={`col-span-3 ${getRatingColor(currentCountryData?.Lifestyle || "70")} font-bold text-right`}
              >
                {getRatingText(currentCountryData?.Lifestyle || "70")}
              </span>
            </div>

            <div className="grid grid-cols-12 items-center text-white text-sm">
              <span className="font-bold col-span-3">Law Enf.:</span>
              <div className="flex space-x-1 col-span-6">
                {renderRatingBars(currentCountryData?.LawEnforcement || "60", "yellow")}
              </div>
              <span
                className={`col-span-3 ${getRatingColor(currentCountryData?.LawEnforcement || "60")} font-bold text-right`}
              >
                {getRatingText(currentCountryData?.LawEnforcement || "60")}
              </span>
            </div>

            <div className="grid grid-cols-12 items-center text-white text-sm">
              <span className="font-bold col-span-3">Media:</span>
              <div className="flex space-x-1 col-span-6">
                {renderRatingBars(currentCountryData?.MediaFreedom || "70", "purple")}
              </div>
              <span
                className={`col-span-3 ${getRatingColor(currentCountryData?.MediaFreedom || "70")} font-bold text-right`}
              >
                {getRatingText(currentCountryData?.MediaFreedom || "70")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom left - City Information */}
      <div className="absolute bottom-2 left-2 z-10 w-96 bg-blue-900 bg-opacity-90 rounded border border-blue-700">
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white p-1 font-bold text-lg flex items-center justify-between">
          <div className="flex items-center">
            <Building className="w-5 h-5 mr-2" />
            CITY INFORMATION
          </div>
          <Info className="w-5 h-5 text-blue-300" />
        </div>

        {isLoading ? (
          <div className="p-4 text-center">Loading city data...</div>
        ) : (
          <>
            {/* City selection */}
            <div className="p-2 border-b border-blue-700 max-h-32 overflow-y-auto">
              <div className="grid grid-cols-3 gap-1">
                {filteredCities.map((city, index) => (
                  <div
                    key={index}
                    className={`p-1 text-xs rounded cursor-pointer ${selectedCity?.CityName === city.CityName ? "bg-blue-700 text-white" : "hover:bg-blue-800 text-gray-300"}`}
                    onClick={() => handleCitySelect(city)}
                  >
                    {city.CityName}
                  </div>
                ))}
              </div>
            </div>

            {/* Selected city details */}
            {selectedCity && (
              <div className="p-2">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-yellow-300">{selectedCity.CityName}</h3>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-300 mr-2">Pop:</span>
                    <span className="text-white font-bold">{selectedCity.Population}</span>
                  </div>
                </div>

                <div className="flex justify-between mb-2">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-300">Safety</span>
                    <div className="w-24 h-6 bg-blue-800 rounded-full relative mt-1">
                      <div
                        className="absolute top-0 left-0 h-full bg-blue-500 rounded-l-full"
                        style={{ width: `${Number.parseFloat(selectedCity.SafetyIndex)}%` }}
                      ></div>
                      <span className="absolute text-[10px] text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold">
                        {selectedCity.SafetyIndex}%
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-300">Crime</span>
                    <div className="w-24 h-6 bg-blue-800 rounded-full relative mt-1">
                      <div
                        className="absolute top-0 left-0 h-full bg-red-500 rounded-l-full"
                        style={{ width: `${Number.parseFloat(selectedCity.CrimeIndex)}%` }}
                      ></div>
                      <span className="absolute text-[10px] text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold">
                        {selectedCity.CrimeIndex}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 mt-3">
                  {[selectedCity.CityType1, selectedCity.CityType2, selectedCity.CityType3, selectedCity.CityType4]
                    .filter(Boolean)
                    .map((type, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full bg-blue-800 border border-blue-600 flex items-center justify-center text-4xl shadow-md">
                          <span>{getCityTypeIcon(type)}</span>
                        </div>
                        <span className="text-white text-sm mt-2">{type}</span>
                      </div>
                    ))}
                </div>

                {selectedCity.CityBonus && (
                  <div className="mt-2 p-1 bg-yellow-900 bg-opacity-50 rounded text-xs text-yellow-300">
                    <span className="font-bold">City Bonus:</span> {selectedCity.CityBonus}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom center - Search and navigation */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10 flex items-center">
        <button
          className="h-10 bg-blue-800 hover:bg-blue-700 px-3 rounded-l border border-blue-600 flex items-center justify-center"
          onClick={() => navigateCountry("prev")}
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        <div className="relative">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-64 h-10 bg-blue-800 border-y border-blue-600 px-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {showCountryList && (
            <div className="absolute bottom-full mb-1 w-64 max-h-48 overflow-y-auto bg-blue-900 border border-blue-700 rounded shadow-lg">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country, index) => (
                  <div
                    key={index}
                    className="px-3 py-1 text-white hover:bg-blue-800 cursor-pointer text-sm"
                    onClick={() => handleCountrySelect(country)}
                  >
                    {country}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-gray-300 text-sm">No countries found</div>
              )}
            </div>
          )}
        </div>

        <button
          className="h-10 bg-blue-800 hover:bg-blue-700 px-3 rounded-r border border-blue-600 flex items-center justify-center"
          onClick={() => navigateCountry("next")}
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Bottom right - Navigation */}
      <div className="absolute bottom-2 right-2 z-10">
        <button className="bg-yellow-600 hover:bg-yellow-500 text-black px-6 py-2 rounded border border-yellow-700 font-bold">
          SELECT
        </button>
      </div>
    </div>
  )
}

