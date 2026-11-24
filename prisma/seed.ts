import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding luxury salon database...");

  // Clean existing tables in reverse dependency order
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.appointmentService.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.staffSchedule.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.service.deleteMany();
  await prisma.category.deleteMany();
  await prisma.salonSettings.deleteMany();
  await prisma.user.deleteMany();

  // 1. Salon Settings
  await prisma.salonSettings.create({
    data: {
      id: "default",
      salonName: "ÉLIXIR HAUTE BEAUTÉ",
      tagline: "Where Artistry Meets Transcendence",
      phone: "+1 (212) 890-7733",
      email: "concierge@elixirhautebeaute.com",
      address: "740 Madison Avenue, Penthouse 4, New York, NY 10065",
      openingTime: "09:00",
      closingTime: "20:00",
      workingDays: "Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday",
      cancellationHoursNotice: 24,
      currencySymbol: "$",
      currencyCode: "USD",
      instagramUrl: "https://instagram.com/elixirhautebeaute",
      whatsappNumber: "+12128907733",
      mapsEmbedUrl: "https://maps.google.com",
    },
  });

  // 2. Users (Admin + Demo Client)
  const adminPassword = await bcrypt.hash("admin123", 10);
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@elixir.luxury",
      passwordHash: adminPassword,
      name: "Genevieve Laurent",
      phone: "+1 (212) 890-7700",
      role: "ADMIN",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    },
  });

  const clientPassword = await bcrypt.hash("client123", 10);
  const clientUser = await prisma.user.create({
    data: {
      email: "client@demo.com",
      passwordHash: clientPassword,
      name: "Sophia Vandermeer",
      phone: "+1 (555) 392-1084",
      role: "CUSTOMER",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    },
  });

  // 3. Categories
  const categoriesData = [
    {
      name: "Haircuts & Styling",
      slug: "haircuts-styling",
      description: "Precision architectural cuts, bespoke French blowouts, and signature runway styling.",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80",
      orderIndex: 1,
    },
    {
      name: "Hair Coloring",
      slug: "hair-coloring",
      description: "Artisanal balayage, French glossing, platinum couture, and multi-dimensional highlights.",
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1000&q=80",
      orderIndex: 2,
    },
    {
      name: "Hair Treatments",
      slug: "hair-treatments",
      description: "Caviar molecular bond repairs, botanical peptide restoration, and liquid silk infusions.",
      image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1000&q=80",
      orderIndex: 3,
    },
    {
      name: "Hair Rebonding",
      slug: "hair-rebonding",
      description: "Japanese precision thermal re-texturizing, organic keratin smoothing, and anti-frizz silk glaze.",
      image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=1000&q=80",
      orderIndex: 4,
    },
    {
      name: "Hair Spa",
      slug: "hair-spa",
      description: "Japanese head spa rituals, micro-mist scalp oxygenation, and warm herbal oil therapy.",
      image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1000&q=80",
      orderIndex: 5,
    },
    {
      name: "Bridal Styling",
      slug: "bridal-styling",
      description: "Haute bridal hair couture, cathedral veil placements, and bespoke matrimonial glam.",
      image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1000&q=80",
      orderIndex: 6,
    },
    {
      name: "Makeup",
      slug: "makeup",
      description: "Red-carpet luminous skin, Paris fashion week editorial aesthetics, and camera-ready glam.",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1000&q=80",
      orderIndex: 7,
    },
    {
      name: "Facial & Skincare",
      slug: "facial-skincare",
      description: "24K Gold Cellular Renewal, oxygen dome infusions, and non-invasive sculpting facials.",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80",
      orderIndex: 8,
    },
    {
      name: "Manicure & Pedicure",
      slug: "manicure-pedicure",
      description: "Russian dry technique, Japanese gel architecture, and gold leaf hand rejuvenations.",
      image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1000&q=80",
      orderIndex: 9,
    },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    createdCategories[cat.slug] = created.id;
  }

  // 4. Services
  const servicesData = [
    // Haircuts & Styling
    {
      name: "Haute Couture Precision Cut & Sculpt",
      slug: "haute-couture-precision-cut",
      categoryId: createdCategories["haircuts-styling"],
      description: "A tailored architectural haircut engineered to frame facial symmetry, followed by deep conditioning and our signature Paris blowout.",
      durationMinutes: 60,
      price: 180,
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
      isFeatured: true,
    },
    {
      name: "Signature Runway French Blowout",
      slug: "signature-french-blowout",
      categoryId: createdCategories["haircuts-styling"],
      description: "High-volume, ultra-glossy velvet blowout finished with cold-shot setting for exceptional multi-day bounce.",
      durationMinutes: 45,
      price: 110,
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      isFeatured: false,
    },
    // Hair Coloring
    {
      name: "Maison Balayage & French Gloss Glaze",
      slug: "maison-balayage-french-gloss",
      categoryId: createdCategories["hair-coloring"],
      description: "Freehand painterly sun-kissed dimension customized for your skin undertone, sealed with an acidic glass gloss treatment.",
      durationMinutes: 150,
      price: 360,
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80",
      isFeatured: true,
    },
    {
      name: "Nordic Platinum Couture Blonding",
      slug: "nordic-platinum-couture",
      categoryId: createdCategories["hair-coloring"],
      description: "Full double-process luminous platinum blonde, formulated with protective lipid bond rebuilders and personalized tone balancing.",
      durationMinutes: 180,
      price: 450,
      image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80",
      isFeatured: false,
    },
    // Hair Treatments
    {
      name: "Caviar & Peptide Molecular Bond Cure",
      slug: "caviar-peptide-cure",
      categoryId: createdCategories["hair-treatments"],
      description: "Deep cellular restoration utilizing black caviar extract and bio-identical keratin peptides to repair extreme heat and color fatigue.",
      durationMinutes: 60,
      price: 220,
      image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80",
      isFeatured: true,
    },
    // Hair Rebonding
    {
      name: "Tokyo Precision Thermal Rebonding",
      slug: "tokyo-precision-thermal-rebonding",
      categoryId: createdCategories["hair-rebonding"],
      description: "State-of-the-art Japanese ionic restructuring that transforms coarse, resistant, or unruly curls into mirror-like, permanent silk straightness.",
      durationMinutes: 210,
      price: 520,
      image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=800&q=80",
      isFeatured: true,
    },
    {
      name: "Organic Liquid Gold Keratin Glaze",
      slug: "organic-liquid-gold-keratin",
      categoryId: createdCategories["hair-rebonding"],
      description: "Formaldehyde-free amino smoothing that eliminates 95% of humidity frizz while preserving natural movement and luxurious softness.",
      durationMinutes: 120,
      price: 320,
      image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80",
      isFeatured: false,
    },
    // Hair Spa
    {
      name: "Japanese Waterfall Head Spa & Scalp Detox",
      slug: "japanese-waterfall-head-spa",
      categoryId: createdCategories["hair-spa"],
      description: "Therapeutic micro-bubble scalp cleansing, herbal steam canopy, botanical meridian massage, and warm rain cascade.",
      durationMinutes: 75,
      price: 240,
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      isFeatured: true,
    },
    // Bridal
    {
      name: "Royal Matrimonial Bridal Styling Suite",
      slug: "royal-bridal-styling-suite",
      categoryId: createdCategories["bridal-styling"],
      description: "Complete matrimonial preview trial, wedding day veil placement, diamond hair accessories arrangement, and all-day champagne service.",
      durationMinutes: 180,
      price: 680,
      image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80",
      isFeatured: true,
    },
    // Makeup
    {
      name: "Lumière Red Carpet Editorial Makeup",
      slug: "lumiere-red-carpet-makeup",
      categoryId: createdCategories["makeup"],
      description: "Flawless HD airbrush complexion, sculpted contouring, luxury silk lash application, and touch-up concierge kit.",
      durationMinutes: 60,
      price: 195,
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
      isFeatured: false,
    },
    // Facial & Skincare
    {
      name: "24K Aurum Cellular Lifting Facial",
      slug: "24k-aurum-cellular-facial",
      categoryId: createdCategories["facial-skincare"],
      description: "Pure 24-karat gold leaf mask combined with micro-current lymphatic sculpting, cryogenic oxygen therapy, and peptide infusion.",
      durationMinutes: 90,
      price: 380,
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
      isFeatured: true,
    },
    // Mani/Pedi
    {
      name: "Imperial Russian Manicure & Cashmere Spa",
      slug: "imperial-russian-manicure",
      categoryId: createdCategories["manicure-pedicure"],
      description: "Medical-grade precision e-file cuticles, structural gel architecture, diamond dust exfoliation, and warm cashmere paraffin wrap.",
      durationMinutes: 75,
      price: 145,
      image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80",
      isFeatured: false,
    },
  ];

  const createdServices: Record<string, string> = {};
  for (const s of servicesData) {
    const created = await prisma.service.create({ data: s });
    createdServices[s.slug] = created.id;
  }

  // 5. Stylists / Staff
  const staffData = [
    {
      name: "Antoine de Montmirail",
      title: "Artistic Director & Master Hair Sculptor",
      bio: "Trained in Paris and Milan with 14 years shaping couture runway shows. Antoine specializes in architectural cuts and transformational silhouette sculpting.",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      experienceYears: 14,
      rating: 4.98,
      reviewCount: 312,
      specializations: "Precision Cut, Runway Styling, Editorial Design, Facial Framing",
      instagram: "@antoine.montmirail",
      email: "antoine@elixirhautebeaute.com",
      phone: "+1 (212) 890-7711",
    },
    {
      name: "Camille Delacroix",
      title: "Head Colorist & French Blonding Alchemist",
      bio: "Celebrated internationally for seamless lived-in balayage and Scandinavian platinum tones. Camille customizes formulas to protect hair cuticle integrity.",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
      experienceYears: 11,
      rating: 4.96,
      reviewCount: 284,
      specializations: "French Balayage, Platinum Blonde, Acidic Glossing, Color Correction",
      instagram: "@camille.coloriste",
      email: "camille@elixirhautebeaute.com",
      phone: "+1 (212) 890-7712",
    },
    {
      name: "Kenji Takahashi",
      title: "Master Texture & Thermal Rebonding Specialist",
      bio: "Direct from Ginza, Tokyo. Kenji is a master of Japanese ionic thermal restructuring, keratin glaze alchemy, and silk-finish hair rehabilitation.",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
      experienceYears: 13,
      rating: 5.0,
      reviewCount: 198,
      specializations: "Japanese Rebonding, Keratin Smoothing, Head Spa, Moisture Therapy",
      instagram: "@kenji.textures",
      email: "kenji@elixirhautebeaute.com",
      phone: "+1 (212) 890-7713",
    },
    {
      name: "Elena Rostova",
      title: "Haute Bridal Couturière & Celebrity Makeup Artist",
      bio: "Crafting bridal masterpieces for royal weddings and red carpet events across Lake Como, Paris, and New York. Known for luminous skin and timeless up-dos.",
      photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
      experienceYears: 9,
      rating: 4.97,
      reviewCount: 245,
      specializations: "Bridal Couture, Red Carpet Glam, HD Airbrush, Cathedral Veils",
      instagram: "@elena.bridalart",
      email: "elena@elixirhautebeaute.com",
      phone: "+1 (212) 890-7714",
    },
    {
      name: "Dr. Marcus Sterling",
      title: "Clinical Aesthetician & Facial Sculpting Artisan",
      bio: "Merging cellular dermatology with European holistic facials. Expert in 24K gold infusions, cryogenic therapy, and non-invasive buccal contouring.",
      photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
      experienceYears: 10,
      rating: 4.94,
      reviewCount: 167,
      specializations: "24K Aurum Facial, Microcurrent Sculpting, Oxygen Dome, Lymphatic Detox",
      instagram: "@marcus.aesthetics",
      email: "marcus@elixirhautebeaute.com",
      phone: "+1 (212) 890-7715",
    },
  ];

  const createdStaff = [];
  for (const staff of staffData) {
    const created = await prisma.staff.create({ data: staff });
    createdStaff.push(created);

    // Create 7-day schedule for each stylist
    for (let day = 0; day <= 6; day++) {
      // Monday (day 1) can be off for Antoine, Sunday (day 0) off for Camille, etc.
      const isDayOff = (staff.name.includes("Antoine") && day === 1) || (staff.name.includes("Kenji") && day === 2);
      await prisma.staffSchedule.create({
        data: {
          staffId: created.id,
          dayOfWeek: day,
          startTime: "09:00",
          endTime: "19:00",
          isWorking: !isDayOff,
          breakStart: "13:00",
          breakEnd: "14:00",
        },
      });
    }
  }

  // 6. Gallery Items
  const galleryData = [
    {
      title: "Champagne Melt Balayage",
      category: "COLOR",
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=80",
      beforeImage: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80",
      description: "Seamless hand-painted French balayage transitioned from brassy copper into creamy champagne pearl.",
      featured: true,
    },
    {
      title: "Cathedral Lace Matrimonial Updo",
      category: "BRIDAL",
      image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1200&q=80",
      beforeImage: null,
      description: "Intricate textured chignon styled with fresh jasmine and antique pearl hairpins.",
      featured: true,
    },
    {
      title: "Architectural Parisian Bob",
      category: "EDITORIAL",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
      beforeImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      description: "Ultra-sharp blunt jawline cut with internal texturizing for natural movement.",
      featured: true,
    },
    {
      title: "Japanese Silk Mirror Rebonding",
      category: "TRANSFORMATION",
      image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=1200&q=80",
      beforeImage: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80",
      description: "Complete reversal of damaged 3C curl texture into liquid glass silk with zero flat-iron required.",
      featured: true,
    },
    {
      title: "Aurum 24K Cellular Facial Glow",
      category: "FACIAL",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80",
      beforeImage: null,
      description: "Post-treatment radiant dermis glow following microcurrent lymphatic drainage and pure 24K leaf.",
      featured: false,
    },
    {
      title: "Atelier Madison Avenue Sanctuary",
      category: "SALON",
      image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80",
      beforeImage: null,
      description: "Our private penthouse styling suite overlooking Central Park with travertine marble and gold accents.",
      featured: true,
    },
    {
      title: "Velvet Red Carpet Glamour",
      category: "EDITORIAL",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80",
      beforeImage: null,
      description: "Soft smoky eyes and luminous satin lips curated for the Met Gala.",
      featured: false,
    },
    {
      title: "Pure Nordic Ice Blonde",
      category: "COLOR",
      image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1200&q=80",
      beforeImage: null,
      description: "Level 10 clean platinum with violet-silver undertones and maximum structural strength.",
      featured: false,
    },
  ];

  for (const item of galleryData) {
    await prisma.galleryItem.create({ data: item });
  }

  // 7. Verified Reviews
  const reviewsData = [
    {
      customerName: "Camilla Rothschild",
      serviceName: "Maison Balayage & French Gloss Glaze",
      rating: 5,
      comment: "ÉLIXIR is hands-down the pinnacle of luxury salon craft in Manhattan. Camille Delacroix perfected my blonde like no one has in Paris or London.",
      date: "February 2027",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
    {
      customerName: "Vivienne Marcheline",
      serviceName: "Haute Couture Precision Cut",
      rating: 5,
      comment: "Antoine's precision cut transformed my silhouette entirely. The penthouse atmosphere with champagne and bespoke fragrance is unforgettable.",
      date: "January 2027",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    },
    {
      customerName: "Seraphina Lin",
      serviceName: "Japanese Waterfall Head Spa",
      rating: 5,
      comment: "The scalp massage and herbal mist rain cascade were pure heaven. My scalp hasn't felt this revitalized in years. 10/10 experience.",
      date: "February 2027",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    },
    {
      customerName: "Genevieve Sterling",
      serviceName: "Royal Matrimonial Bridal Styling Suite",
      rating: 5,
      comment: "Elena made my wedding morning an absolute dream. Calm, exquisitely professional, and my hair held flawlessly for 14 hours through dancing.",
      date: "December 2026",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
    },
  ];

  for (const rev of reviewsData) {
    await prisma.review.create({ data: rev });
  }

  // 8. Initial Appointments (Real Appointments for Demo Client and Admin Dashboard)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 5);
  const nextWeekStr = nextWeek.toISOString().split("T")[0];

  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const lastWeekStr = lastWeek.toISOString().split("T")[0];

  // Appointment 1: Tomorrow for Sophia with Antoine
  const apt1 = await prisma.appointment.create({
    data: {
      bookingReference: "ELX-2027-8492",
      customerId: clientUser.id,
      customerName: clientUser.name,
      customerEmail: clientUser.email,
      customerPhone: clientUser.phone || "+1 (555) 392-1084",
      notes: "Client prefers sparkling water with lime. Seeking face-framing curtain layers.",
      staffId: createdStaff[0].id,
      date: tomorrowStr,
      startTime: "11:00",
      endTime: "12:00",
      totalDuration: 60,
      totalPrice: 180,
      status: "CONFIRMED",
      appointmentServices: {
        create: [
          {
            serviceId: createdServices["haute-couture-precision-cut"],
            priceAtBooking: 180,
            durationAtBooking: 60,
          },
        ],
      },
    },
  });

  // Appointment 2: Next week for Sophia with Camille
  const apt2 = await prisma.appointment.create({
    data: {
      bookingReference: "ELX-2027-9104",
      customerId: clientUser.id,
      customerName: clientUser.name,
      customerEmail: clientUser.email,
      customerPhone: clientUser.phone || "+1 (555) 392-1084",
      notes: "Balayage refresh before Paris Fashion Week.",
      staffId: createdStaff[1].id,
      date: nextWeekStr,
      startTime: "14:00",
      endTime: "16:30",
      totalDuration: 150,
      totalPrice: 360,
      status: "PENDING",
      appointmentServices: {
        create: [
          {
            serviceId: createdServices["maison-balayage-french-gloss"],
            priceAtBooking: 360,
            durationAtBooking: 150,
          },
        ],
      },
    },
  });

  // Appointment 3: Past completed appointment
  await prisma.appointment.create({
    data: {
      bookingReference: "ELX-2027-6320",
      customerId: clientUser.id,
      customerName: clientUser.name,
      customerEmail: clientUser.email,
      customerPhone: clientUser.phone || "+1 (555) 392-1084",
      notes: "First time visit. Loved the herbal tea.",
      staffId: createdStaff[2].id,
      date: lastWeekStr,
      startTime: "15:00",
      endTime: "16:15",
      totalDuration: 75,
      totalPrice: 240,
      status: "COMPLETED",
      appointmentServices: {
        create: [
          {
            serviceId: createdServices["japanese-waterfall-head-spa"],
            priceAtBooking: 240,
            durationAtBooking: 75,
          },
        ],
      },
    },
  });

  // Appointment 4: Guest booking for Admin calendar view
  await prisma.appointment.create({
    data: {
      bookingReference: "ELX-2027-5119",
      customerId: null,
      customerName: "Isabella Martinez",
      customerEmail: "isabella.m@vogue.fr",
      customerPhone: "+1 (917) 440-1928",
      notes: "Editorial shoot prep. Needs fast drying.",
      staffId: createdStaff[0].id,
      date: tomorrowStr,
      startTime: "14:00",
      endTime: "15:00",
      totalDuration: 60,
      totalPrice: 180,
      status: "CONFIRMED",
      appointmentServices: {
        create: [
          {
            serviceId: createdServices["haute-couture-precision-cut"],
            priceAtBooking: 180,
            durationAtBooking: 60,
          },
        ],
      },
    },
  });

  // 9. Initial Notifications
  await prisma.notification.createMany({
    data: [
      {
        role: "ADMIN",
        title: "New VIP Booking Confirmed",
        message: `Sophia Vandermeer booked Haute Couture Precision Cut for ${tomorrowStr} at 11:00 AM with Antoine.`,
        read: false,
        link: "/admin/appointments",
      },
      {
        role: "ADMIN",
        title: "Pending Approval",
        message: `Sophia Vandermeer requested Maison Balayage for ${nextWeekStr} at 02:00 PM.`,
        read: false,
        link: "/admin/appointments",
      },
      {
        userId: clientUser.id,
        role: "CUSTOMER",
        title: "Appointment Confirmed",
        message: `Your appointment with Antoine de Montmirail is confirmed for ${tomorrowStr} at 11:00 AM.`,
        read: false,
        link: "/dashboard",
      },
    ],
  });

  console.log("Database successfully seeded with luxury 2027 salon catalog, staff, schedules, and bookings!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
