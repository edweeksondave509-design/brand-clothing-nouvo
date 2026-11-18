import { StoreProvider } from '@/components/store/store-provider'
import { SeasonBar } from '@/components/store/season-bar'
import { Navbar } from '@/components/store/navbar'
import { Hero } from '@/components/store/hero'
import { VipBanner } from '@/components/store/vip-banner'
import { SpecialSection } from '@/components/store/special-section'
import { Catalog } from '@/components/store/catalog'
import { VipClub } from '@/components/store/vip-club'
import { Footer } from '@/components/store/footer'
import { CartDrawer } from '@/components/store/cart-drawer'
import { WhatsAppFloat } from '@/components/store/whatsapp-float'
import { AdminGate } from '@/components/admin/admin-gate'

export default function Page() {
  return (
    <StoreProvider>
      <SeasonBar />
      <Navbar />
      <main>
        <Hero />
        <VipBanner />
        <SpecialSection />
        <Catalog />
        <VipClub />
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppFloat />
      <AdminGate />
    </StoreProvider>
  )
}
