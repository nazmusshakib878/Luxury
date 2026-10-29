import React from "react"
import { ShopProvider } from "./context/ShopContext"
import { AnnouncementBar } from "./components/layout/AnnouncementBar"
import { Navbar } from "./components/layout/Navbar"
import { Footer } from "./components/layout/Footer"
import { Hero } from "./components/home/Hero"
import { EditorialStrip } from "./components/home/EditorialStrip"
import { CategoriesSection } from "./components/home/CategoriesSection"
import { ProductGrid } from "./components/home/ProductGrid"
import { CampaignSection } from "./components/home/CampaignSection"
import { ServicesSection } from "./components/home/ServicesSection"
import { TestimonialSection } from "./components/home/TestimonialSection"
import { SocialGallery } from "./components/home/SocialGallery"
import { NewsletterSection } from "./components/home/NewsletterSection"
import { CartDrawer } from "./components/modals/CartDrawer"
import { WishlistDrawer } from "./components/modals/WishlistDrawer"
import { SearchModal } from "./components/modals/SearchModal"
import { ProductQuickViewModal } from "./components/modals/ProductQuickViewModal"
import { AccountModal } from "./components/modals/AccountModal"
import { AppointmentModal } from "./components/modals/AppointmentModal"
import { CheckoutModal } from "./components/modals/CheckoutModal"
import { CurrencyModal } from "./components/modals/CurrencyModal"
import { ToastContainer } from "./components/common/Toast"
import { ScrollToTop } from "./components/common/ScrollToTop"

function AureliaApp() {
  return (
    <div className="site-shell" id="top">
      <AnnouncementBar />
      <Navbar />

      <main>
        <Hero />
        <EditorialStrip />
        <CategoriesSection />
        <ProductGrid />
        <CampaignSection />
        <ServicesSection />
        <TestimonialSection />
        <SocialGallery />
        <NewsletterSection />
      </main>

      <Footer />

      {/* Drawers, Modals & Floating Notifications */}
      <CartDrawer />
      <WishlistDrawer />
      <SearchModal />
      <ProductQuickViewModal />
      <AccountModal />
      <AppointmentModal />
      <CheckoutModal />
      <CurrencyModal />
      <ToastContainer />
      <ScrollToTop />
    </div>
  )
}

export default function App() {
  return (
    <ShopProvider>
      <AureliaApp />
    </ShopProvider>
  )
}
