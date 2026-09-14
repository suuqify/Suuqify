export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 sm:p-12">
      {/* Container-ka guud */}
      <main className="w-full max-w-2xl flex flex-col items-center text-center gap-8">
        
        {/* 1. Badge / Secondary Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold tracking-wide border border-border">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Suuqify Design System
        </div>

        {/* 2. Cinwaanka Weyn & Faahfaahinta */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Dukaankaaga Online-ka ah, <br />
            <span className="text-primary">Hal Gujiso Ku Bilow</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto">
            Madal casri ah oo fududaynaysa iibka ganacsatada TikTok & Instagram adoo isticmaalaya WhatsApp fariin diyaarsan.
          </p>
        </div>

        {/* 3. Badhamada (Primary & Secondary Buttons) */}
        <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto">
          {/* Primary Button */}
          <button className="h-12 px-7 rounded-xl bg-primary text-primary-foreground font-medium transition-all hover:opacity-90 shadow-sm active:scale-95">
            Dukaan Abuur Hadda
          </button>

          {/* Secondary Button */}
          <button className="h-12 px-7 rounded-xl bg-secondary text-secondary-foreground font-medium transition-all hover:bg-secondary/80 border border-border active:scale-95">
            Fiiri Dukaamada VIP
          </button>
        </div>

        {/* 4. Tusaale Kaadhka Alaabta (Card Preview) */}
        <div className="w-full max-w-sm mt-6 p-4 rounded-2xl bg-card border border-border shadow-sm text-left">
          <div className="w-full h-44 rounded-xl bg-muted flex items-center justify-center text-muted-foreground font-medium">
            Sawirka Alaabta (Image)
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Cadar Carfiye VIP</h3>
              <span className="text-primary font-bold text-lg">$25.00</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Cadar caraf macaan leh oo maalintii oo dhan kugu haraya.
            </p>

            {/* Batoonka WhatsApp-ka */}
            <button className="w-full mt-3 h-11 rounded-xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all">
              Kala xiriir WhatsApp
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}