// Service de persistance des données
// Implémente une couche d'abstraction (Repository Pattern) avec store mémoire rapide
// et prêt pour le branchement immédiat sur PostgreSQL / Supabase.

class DatabaseService {
  constructor() {
    this.users = [
      {
        id: 'user_admin_001',
        googleId: 'google_admin_seed',
        email: 'contact@bhihi.studio',
        name: 'Abdelilah Bhihi',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        phoneWhatsapp: '+212600000000',
        role: 'admin',
        status: 'active',
        createdAt: new Date().toISOString(),
      },
    ];

    this.courses = [
      {
        id: 'course_sanaa_masterclass',
        title: 'صَنْعة: أسرار الإخراج الوثائقي والإنتاج السينمائي',
        description: 'دورة تدريبية متكاملة تنقلك من الفكرة إلى الشاشة عبر أكثر من 15 سنة من الخبرة مع الجزيرة، DW، والتلفزيون العربي.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&w=1200&q=80',
        isPublished: true,
        modules: [
          {
            id: 'mod_01',
            title: 'الوحدة 1: لغة الصورة وبناء السرد البصري (Storytelling)',
            sortOrder: 1,
            videos: [
              {
                id: 'vid_01',
                title: 'الدرس 1: فلسفة التوثيق وكيف تحكي قصة تؤثر في المشاهد',
                description: 'مدخل إلى أسس السرد الوثائقي، كيف تختار زاوية المعالجة، والفرق بين نقل الواقع وتصوير الحقيقة.',
                durationSeconds: 1420, // 23 min
                drmVideoId: 'vdo_demo_sample_01',
                isFreePreview: true,
                resourcesPdfUrl: '/uploads/resources/lesson-01-guide.pdf',
              },
              {
                id: 'vid_02',
                title: 'الدرس 2: هندسة المشهد: اختيار العدسات وحركة الكاميرا',
                description: 'تحليل عملي للعدسات المستخدمة في الأفلام الوثائقية، متى تستخدم 35mm ومتى تختار 85mm لخلق العاطفة.',
                durationSeconds: 1840,
                drmVideoId: 'vdo_demo_sample_02',
                isFreePreview: false,
                resourcesPdfUrl: '/uploads/resources/lens-cheat-sheet.pdf',
              },
            ],
          },
          {
            id: 'mod_02',
            title: 'الوحدة 2: الإضاءة الواقعية وإدارة مواقع التصوير',
            sortOrder: 2,
            videos: [
              {
                id: 'vid_03',
                title: 'الدرس 3: الإضاءة بأسلوب سينمائي طبيعي (Cinematic Natural Light)',
                description: 'كيف تصنع عمقاً ودراما في المقابلات بأقل المعدات الممكنة مع استغلال النور الطبيعي.',
                durationSeconds: 2100,
                drmVideoId: 'vdo_demo_sample_03',
                isFreePreview: false,
                resourcesPdfUrl: null,
              },
              {
                id: 'vid_04',
                title: 'الدرس 4: إدارة المقابلة الوثائقية مع شخصيات صعبة',
                description: 'تقنيات نفسية لإراحة الضيف وجعله ينسى وجود الكاميرا للوصول إلى اعترافات عميقة وحقيقية.',
                durationSeconds: 1950,
                drmVideoId: 'vdo_demo_sample_04',
                isFreePreview: false,
                resourcesPdfUrl: null,
              },
            ],
          },
        ],
      },
    ];

    this.subscriptions = [];
    this.payments = [];
  }

  // --- Users ---
  findUserByGoogleId(googleId) {
    return this.users.find((u) => u.googleId === googleId);
  }

  findUserByEmail(email) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    return this.users.find((u) => u.id === id);
  }

  createUser(userData) {
    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      role: 'student',
      status: 'lead', // lead -> pending_approval -> active
      createdAt: new Date().toISOString(),
      ...userData,
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id, updates) {
    const user = this.findUserById(id);
    if (!user) return null;
    Object.assign(user, updates, { updatedAt: new Date().toISOString() });
    return user;
  }

  getAllUsers() {
    return this.users;
  }

  // --- Subscriptions & Payments ---
  createPayment(paymentData) {
    const newPayment = {
      id: `pay_${Date.now()}`,
      status: 'pending', // pending -> approved -> rejected
      createdAt: new Date().toISOString(),
      ...paymentData,
    };
    this.payments.push(newPayment);
    return newPayment;
  }

  getPendingPayments() {
    return this.payments
      .filter((p) => p.status === 'pending')
      .map((p) => {
        const user = this.findUserById(p.userId);
        return {
          ...p,
          user: user
            ? {
                name: user.name,
                email: user.email,
                phoneWhatsapp: user.phoneWhatsapp,
                avatarUrl: user.avatarUrl,
              }
            : null,
        };
      });
  }

  approvePayment(paymentId, adminId) {
    const payment = this.payments.find((p) => p.id === paymentId);
    if (!payment) return null;

    payment.status = 'approved';
    payment.reviewedByAdminId = adminId;
    payment.reviewedAt = new Date().toISOString();

    // Activer l'utilisateur
    this.updateUser(payment.userId, { status: 'active' });

    // Créer la souscription
    const subscription = {
      id: `sub_${Date.now()}`,
      userId: payment.userId,
      planType: payment.planType || 'lifetime',
      status: 'active',
      startsAt: new Date().toISOString(),
      expiresAt: null, // Accès à vie par défaut
    };
    this.subscriptions.push(subscription);

    return { payment, subscription };
  }

  rejectPayment(paymentId, adminId, reason) {
    const payment = this.payments.find((p) => p.id === paymentId);
    if (!payment) return null;

    payment.status = 'rejected';
    payment.reviewedByAdminId = adminId;
    payment.rejectionReason = reason;
    payment.reviewedAt = new Date().toISOString();

    this.updateUser(payment.userId, { status: 'rejected' });
    return payment;
  }

  // --- Courses & Videos ---
  getCourses() {
    return this.courses;
  }

  findVideoById(videoId) {
    for (const course of this.courses) {
      for (const module of course.modules) {
        const video = module.videos.find((v) => v.id === videoId);
        if (video) return video;
      }
    }
    return null;
  }
}

export const db = new DatabaseService();
