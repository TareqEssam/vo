/**
 * 🧠 VoiceAgent Pro v4.0 - المساعد الذكي المتكامل
 * يستفيد بالكامل من NeuralSearch v6 دون تكرار
 * 
 * المزايا:
 * ✨ طبقة ذكاء صوتي متقدمة فوق NeuralSearch
 * 🎯 ذاكرة سياقية حقيقية (30 سؤال)
 * 🧬 كشف النية مع استبعاد النتائج غير المنطقية
 * 💡 واجهات احترافية للخيارات والاقتراحات
 * 🎨 تجربة مستخدم صوتية متطورة
 * ⚡ استغلال كامل لإمكانيات NeuralSearch
 */

// ==================== 🧠 حالة الذكاء الاصطناعي ====================
const AI_STATE = {
    apiKey: " ",
    conversationHistory: [],      // سجل الحوار الكامل
    maxHistory: 30,                // حد الذاكرة
    currentActivity: null,         // النشاط الحالي في السياق
    lastIntent: 'general',         // آخر نية مكتشفة
    userPreferences: new Map(),    // تفضيلات المستخدم المتعلمة
    sessionStart: Date.now()
};

// ==================== 🎯 طبقة الذكاء الصوتي ====================
const VoiceIntelligence = {
    
    /**
     * 🔍 البحث الذكي مع السياق
     */
    smartSearch(query, options = {}) {
        const {
            useContext = true,
            minConfidence = 'auto',
            maxResults = 5,
            respectIntent = true
        } = options;
        
        console.log('🧠 بدء البحث الذكي:', { query, useContext });
        
        // استدعاء محرك NeuralSearch الأصلي
        const rawResults = window.NeuralSearch(query, masterActivityDB);
        
        // التحليل الذكي للنتائج
        const analyzed = this.analyzeResults(rawResults, query, options);
        
        // تسجيل في السجل
        this.logSearch(query, analyzed);
        
        return analyzed;
    },
    
    /**
     * 📊 محلل النتائج المتقدم
     */
    analyzeResults(searchData, query, options) {
        const { results, suggestion, suggestions, stats } = searchData;
        
        if (!results || results.length === 0) {
            return {
                bestMatch: null,
                alternatives: [],
                confidence: 0,
                shouldAskUser: true,
                suggestions: suggestions || [],
                failureReason: 'no_results',
                stats
            };
        }
        
        // كشف النية من الاستعلام
        const queryIntent = this.detectQueryIntent(query);
        
        // تصفية ذكية (استبعاد غير المنطقي)
        const filtered = this.intelligentFilter(results, query, queryIntent);
        
        // ترتيب حسب السياق
        const contextSorted = this.contextualSort(filtered, queryIntent);
        
        // حساب الثقة الديناميكية
        const confidence = this.calculateConfidence(contextSorted, query, stats, queryIntent);
        
        // شرح القرار
        const reasoning = this.explainDecision(contextSorted[0], query, confidence);
        
        return {
            bestMatch: contextSorted[0] || null,
            alternatives: contextSorted.slice(1, options.maxResults),
            allFiltered: contextSorted,
            confidence: confidence,
            shouldAskUser: confidence < 0.7,
            suggestions: suggestions,
            queryIntent: queryIntent,
            reasoning: reasoning,
            stats: stats
        };
    },
    
    /**
     * 🎲 حساب الثقة الديناميكي
     */
    calculateConfidence(results, query, stats, queryIntent) {
        if (!results || results.length === 0) return 0;
        
        const top = results[0];
        const queryWords = query.trim().split(/\s+/).length;
        
        // عوامل الثقة المتعددة
        const factors = {
            // 1. درجة التطابق الأساسية (40%)
            scoreBase: Math.min(top.finalScore / 1000, 1) * 0.4,
            
            // 2. التطابق الدلالي (20%)
            semantic: Math.min((top.semanticScore || 0) / 5, 1) * 0.2,
            
            // 3. عدد أنواع التطابقات (15%)
            matchDiversity: Math.min((top.matchTypes || 1) / 6, 1) * 0.15,
            
            // 4. وضوح الاستعلام (10%)
            queryClarity: (queryWords >= 2 && queryWords <= 5 ? 1 : 0.7) * 0.1,
            
            // 5. الفجوة مع النتيجة الثانية (10%)
            gap: results.length > 1 ? 
                Math.min((top.finalScore - results[1].finalScore) / 500, 1) * 0.1 : 0.1,
            
            // 6. توافق النية (5%)
            intentMatch: queryIntent.category && this.matchesIntent(top, queryIntent) ? 0.05 : 0
        };
        
        const totalConfidence = Object.values(factors).reduce((sum, val) => sum + val, 0);
        
        console.log('📊 حساب الثقة:', {
            score: top.finalScore,
            confidence: (totalConfidence * 100).toFixed(1) + '%',
            factors
        });
        
        return totalConfidence;
    },
    
    /**
     * 🧬 كاشف النية المتقدم
     */
    detectQueryIntent(query) {
        const normalized = query.toLowerCase().trim();
        
        // خريطة النوايا القوية مع التعارضات
        const intentMap = {
            'مجازر|مجزر|ذبح|لحوم حمراء|ماشية للذبح': {
                category: 'slaughter',
                keywords: ['مجازر', 'ذبح', 'لحوم'],
                conflicts: ['صناعي عام', 'كيماوي', 'معمل', 'نسيج', 'غزل'],
                boost: 1.3
            },
            'صيدلية|دواء|عقاقير|ادوية|pharmacy': {
                category: 'pharmacy',
                keywords: ['صيدلية', 'دواء'],
                conflicts: ['مطعم', 'طعام', 'اكل', 'سياحة', 'فندق'],
                boost: 1.4
            },
            'مطعم|كافيه|مقهى|كافتيريا|restaurant': {
                category: 'restaurant',
                keywords: ['مطعم', 'اكل', 'طعام'],
                conflicts: ['مصنع', 'انتاج', 'معمل', 'صيدلية'],
                boost: 1.3
            },
            'مصنع|تصنيع|انتاج|معمل|factory': {
                category: 'manufacturing',
                keywords: ['مصنع', 'انتاج', 'تصنيع'],
                conflicts: ['مطعم', 'عيادة', 'صيدلية'],
                boost: 1.2
            },
            'تخزين|مخزن|مستودع|warehouse|ثلاجة|تبريد': {
                category: 'storage',
                keywords: ['تخزين', 'مخزن', 'مستودع'],
                conflicts: ['عيادة', 'صيدلية مباشرة'],
                boost: 1.3
            },
            'عيادة|طبيب|دكتور|مركز طبي|clinic': {
                category: 'medical',
                keywords: ['عيادة', 'طبيب', 'علاج'],
                conflicts: ['مطعم', 'مصنع', 'مخزن'],
                boost: 1.4
            },
            'فندق|منتجع|سياحة|hotel|resort': {
                category: 'tourism',
                keywords: ['فندق', 'سياحة', 'منتجع'],
                conflicts: ['مصنع', 'معمل', 'انتاج'],
                boost: 1.3
            },
            'زراعة|مزرعة|محصول|farm': {
                category: 'agriculture',
                keywords: ['زراعة', 'مزرعة'],
                conflicts: ['صناعي', 'معمل'],
                boost: 1.2
            }
        };
        
        // البحث عن تطابق
        for (const [pattern, intent] of Object.entries(intentMap)) {
            const regex = new RegExp(pattern, 'i');
            if (regex.test(normalized)) {
                console.log('🎯 نية مكتشفة:', intent.category);
                return {
                    category: intent.category,
                    keywords: intent.keywords,
                    conflicts: intent.conflicts,
                    boost: intent.boost,
                    confidence: 'high'
                };
            }
        }
        
        return {
            category: null,
            keywords: [],
            conflicts: [],
            boost: 1.0,
            confidence: 'low'
        };
    },
    
    /**
     * 🔬 تصفية ذكية (استبعاد النتائج غير المنطقية)
     */
    intelligentFilter(results, query, queryIntent) {
        if (!queryIntent.conflicts || queryIntent.conflicts.length === 0) {
            return results; // لا يوجد تعارضات - إرجاع كل شيء
        }
        
        const filtered = results.filter(activity => {
            // جمع كل النصوص المتعلقة بالنشاط
            const activityText = [
                activity.text,
                ...(activity.keywords || []),
                ...(activity.synonyms || []),
                activity.details?.act || ''
            ].join(' ').toLowerCase();
            
            // فحص التعارضات
            const hasConflict = queryIntent.conflicts.some(conflict => 
                activityText.includes(conflict.toLowerCase())
            );
            
            // استبعاد فقط إذا كان التعارض موجود والدرجة منخفضة
            if (hasConflict && activity.finalScore < 400) {
                console.log('🚫 استبعاد:', activity.text, '- تعارض مع النية');
                return false;
            }
            
            return true;
        });
        
        console.log(`🔬 تصفية: ${results.length} → ${filtered.length} نتيجة`);
        return filtered;
    },
    
    /**
     * 🔄 ترتيب حسب السياق
     */
    contextualSort(results, queryIntent) {
        if (!queryIntent.boost || queryIntent.boost === 1.0) {
            return results; // لا حاجة لإعادة الترتيب
        }
        
        // إعادة حساب الدرجات مع تعزيز النية
        return results.map(activity => {
            const intentBoost = this.matchesIntent(activity, queryIntent) ? 
                queryIntent.boost : 1.0;
            
            return {
                ...activity,
                contextScore: activity.finalScore * intentBoost,
                intentBoosted: intentBoost > 1.0
            };
        }).sort((a, b) => b.contextScore - a.contextScore);
    },
    
    /**
     * ✅ فحص توافق النشاط مع النية
     */
    matchesIntent(activity, queryIntent) {
        if (!queryIntent.keywords || queryIntent.keywords.length === 0) {
            return false;
        }
        
        const activityText = [
            activity.text,
            ...(activity.keywords || []),
            ...(activity.synonyms || [])
        ].join(' ').toLowerCase();
        
        return queryIntent.keywords.some(kw => 
            activityText.includes(kw.toLowerCase())
        );
    },
    
    /**
     * 💡 شرح القرار
     */
    explainDecision(activity, query, confidence) {
        if (!activity) {
            return 'لم يتم العثور على تطابق مناسب';
        }
        
        const reasons = [];
        
        if (activity.finalScore > 2000) {
            reasons.push('تطابق تام مع الاستعلام');
        } else if (activity.finalScore > 1000) {
            reasons.push('تطابق قوي جداً');
        } else if (activity.finalScore > 500) {
            reasons.push('تطابق جيد');
        }
        
        if (activity.semanticScore > 3) {
            reasons.push('فهم دلالي عميق');
        }
        
        if (activity.matchTypes > 5) {
            reasons.push('تطابقات متعددة');
        }
        
        if (activity.intentBoosted) {
            reasons.push('مطابق للنية المكتشفة');
        }
        
        if (confidence > 0.85) {
            reasons.push('ثقة عالية جداً');
        } else if (confidence > 0.7) {
            reasons.push('ثقة جيدة');
        }
        
        return reasons.join(' • ');
    },
    
    /**
     * 📝 تسجيل البحث
     */
    logSearch(query, result) {
        const logEntry = {
            timestamp: Date.now(),
            query: query,
            activity: result.bestMatch?.text || null,
            confidence: result.confidence,
            alternatives: result.alternatives.length
        };
        
        console.log('📝 سجل البحث:', logEntry);
    }
};

// ==================== 🎭 محلل السياق المتقدم ====================
const ContextEngine = {
    
    /**
     * 🔍 تحليل السياق لتحديد إذا كان السؤال عن نشاط جديد أم تفاصيل
     */
    analyzeContext(query) {
        const normalized = query.toLowerCase().trim();
        
        // كلمات تدل على طلب تفاصيل (لا تغيير في النشاط)
        const detailTriggers = [
            'موقع', 'مكان', 'فين', 'أين', 'اين',
            'سند', 'قانون', 'تشريع', 'قرار',
            'ترخيص', 'رخصة', 'ورق', 'مستندات',
            'ملاحظات', 'فني', 'تقني', 'شروط',
            'جهة', 'مين', 'وزارة', 'هيئة',
            '104', 'لائحة', 'اشتراطات',
            'دليل', 'ارشادات', 'جايد', 'guide'
        ];
        
        // كلمات تدل على التحويل لنشاط جديد
        const switchTriggers = [
            'طيب', 'طب', 'لو', 'ماذا عن', 'وماذا عن',
            'بالنسبة', 'اريد', 'ابحث', 'عايز',
            'غير', 'بدلا', 'instead'
        ];
        
        const isDetailQuestion = detailTriggers.some(trigger => 
            normalized.includes(trigger)
        );
        
        const isSwitchRequest = switchTriggers.some(trigger => 
            normalized.includes(trigger)
        );
        
        // المنطق: إذا كان هناك نشاط حالي + سؤال عن تفاصيل + لا يوجد طلب تحويل
        const shouldUseCurrentActivity = 
            AI_STATE.currentActivity && 
            isDetailQuestion && 
            !isSwitchRequest;
        
        console.log('🎭 تحليل السياق:', {
            hasCurrentActivity: !!AI_STATE.currentActivity,
            isDetailQuestion,
            isSwitchRequest,
            decision: shouldUseCurrentActivity ? 'استخدام النشاط الحالي' : 'البحث عن نشاط جديد'
        });
        
        return {
            shouldUseCurrentActivity,
            isDetailQuestion,
            isSwitchRequest,
            currentActivity: AI_STATE.currentActivity
        };
    },
    
    /**
     * 🔄 تحديث السياق
     */
    updateContext(activity, query, intent) {
        AI_STATE.currentActivity = activity;
        AI_STATE.lastIntent = intent;
        
        // إضافة للسجل
        AI_STATE.conversationHistory.push({
            timestamp: Date.now(),
            query: query,
            activity: activity?.text,
            intent: intent
        });
        
        // تنظيف السجل إذا تجاوز الحد
        if (AI_STATE.conversationHistory.length > AI_STATE.maxHistory) {
            AI_STATE.conversationHistory.shift();
        }
        
        console.log('🔄 تحديث السياق:', {
            activity: activity?.text,
            historySize: AI_STATE.conversationHistory.length
        });
    },
    
    /**
     * 🧹 مسح السياق
     */
    clearContext() {
        AI_STATE.currentActivity = null;
        AI_STATE.lastIntent = 'general';
        console.log('🧹 تم مسح السياق');
    }
};



/**
 * 🔄 معالج الأسئلة الغامضة وغير المباشرة
 */
function preprocessVagueQuery(query) {
    const normalized = query.toLowerCase().trim();
    
    // أنماط الأسئلة غير المباشرة
    const vaguePatterns = [
        {
            // "عاوز اعرف" / "اريد معرفة" / "ممكن تقولي"
            pattern: /^(عاوز|عايز|اريد|ابغى|ممكن|نفسي|احب)\s+(اعرف|معرفة|افهم|تقولي|تقول لي|تفهمني)/i,
            action: () => {
                speak('طبعاً! اسأل عن أي نشاط تريد معرفة تفاصيله، مثل: مصنع، مطعم، صيدلية، مخزن، أو أي نشاط آخر.');
                return null; // إيقاف المعالجة
            }
        },
        {
            // "ازاي" / "كيف" بدون سياق
            pattern: /^(ازاي|ازى|كيف|how)\s+(اعمل|انشئ|افتح|ابدأ)?$/i,
            action: () => {
                speak('أخبرني عن النشاط الذي تريد معرفة كيفية إنشائه، مثل: كيف أفتح مطعم؟ أو كيف أبدأ مصنع؟');
                return null;
            }
        },
        {
            // "ايه" / "وش" / "ما هو" بدون سياق
            pattern: /^(ايه|اية|ايش|وش|ما هو|ما هي|what is)\s*(ال)?$/i,
            action: () => {
                speak('ما الذي تريد معرفته بالتحديد؟ اذكر اسم النشاط أو نوعه.');
                return null;
            }
        },
        {
            // "فين" / "وين" / "أين" بدون سياق
            pattern: /^(فين|فيين|وين|وينه|أين|اين|where)\s*(ال)?$/i,
            action: () => {
                speak('أي نشاط تبحث عن موقعه؟ مثل: فين أفتح مخزن تبريد؟');
                return null;
            }
        },
        {
            // محاولة استخراج النشاط من سؤال غير مباشر
            pattern: /(عاوز|اريد|ممكن|نفسي).+(اعرف|افهم|معرفة)\s+(.+)/i,
            action: (match) => {
                const extracted = match[3].trim();
                console.log('🔄 استخراج نشاط من سؤال غامض:', extracted);
                return extracted; // إرجاع النشاط المستخرج
            }
        },
        {
            // "ازاي اعمل X" -> "X"
            pattern: /(ازاي|كيف|how).+(اعمل|افتح|ابدأ|انشئ)\s+(.+)/i,
            action: (match) => {
                const extracted = match[3].trim();
                console.log('🔄 استخراج من سؤال "كيف":', extracted);
                return extracted;
            }
        },
        {
            // "عايز افتح X" -> "X"
            pattern: /(عاوز|عايز|اريد|ممكن)\s+(افتح|اعمل|ابدأ)\s+(.+)/i,
            action: (match) => {
                const extracted = match[3].trim();
                console.log('🔄 استخراج من "عايز افتح":', extracted);
                return extracted;
            }
        }
    ];
    
    // فحص الأنماط
    for (const {pattern, action} of vaguePatterns) {
        const match = normalized.match(pattern);
        if (match) {
            const result = action(match);
            if (result === null) {
                // إيقاف المعالجة - تم الرد على المستخدم
                throw new Error('VAGUE_QUERY_HANDLED');
            }
            return result; // إرجاع الاستعلام المحسّن
        }
    }
    
    return query; // إرجاع الاستعلام كما هو
}

// ==================== 🎙️ المحرك الرئيسي للمعالجة ====================
async function handleIntelligence(query) {
    console.log('💬 استعلام جديد:', query);
    
    try {
        // 🔍 معالجة الأسئلة غير المباشرة أولاً
        const processedQuery = preprocessVagueQuery(query);
        
        // 1️⃣ تحليل السياق
        const context = ContextEngine.analyzeContext(processedQuery);
    
    let activity = null;
    let searchResult = null;
    
    // 2️⃣ اتخاذ القرار بناءً على السياق
    if (context.shouldUseCurrentActivity) {
        // استخدام النشاط من الذاكرة
        activity = context.currentActivity;
        console.log('♻️ استخدام النشاط من الذاكرة:', activity.text);
        
    } else {
        // البحث العصبي الذكي
        searchResult = VoiceIntelligence.smartSearch(query, {
            useContext: true,
            maxResults: 5,
            respectIntent: true
        });
        
        // 3️⃣ معالجة النتائج حسب مستوى الثقة
        if (searchResult.confidence >= 0.85) {
            // ✅ ثقة عالية جداً - تنفيذ مباشر
            activity = searchResult.bestMatch;
            ContextEngine.updateContext(activity, query, 'general');
            console.log('✅ ثقة عالية - تنفيذ مباشر:', activity.text);
            
        } else if (searchResult.confidence >= 0.5) {
            // 🤔 ثقة متوسطة - عرض خيارات
            console.log('🤔 ثقة متوسطة - عرض خيارات');
            showSmartChoices(searchResult);
            return; // انتظار اختيار المستخدم
            
        } else {
            // ❌ ثقة منخفضة - اقتراحات ذكية
            console.log('❌ ثقة منخفضة - عرض اقتراحات');
            showSmartSuggestions(searchResult, query);
            return;
        }
    }
    
    // 4️⃣ التحقق النهائي
    if (!activity) {
        speak('عذراً، لم أستطع تحديد النشاط بدقة. يرجى إعادة الصياغة بوضوح أكبر.');
        return;
    }
    
    // 5️⃣ تصنيف النية النهائية
    const userIntent = classifyUserIntent(query);
    
    // 6️⃣ بناء الرد
    let responseText = "";
    if (window.SESSION_AI_ENABLED) {
        toggleLoader(true);
        responseText = await getRealAIResponse(query, activity, userIntent);
        toggleLoader(false);
    } else {
        responseText = getLocalKnowledge(activity, userIntent);
    }
    
    // 7️⃣ النطق والعرض
    speak(responseText);
    showExpertDashboard(activity, userIntent, responseText, searchResult);
    
    } catch (error) {
        if (error.message === 'VAGUE_QUERY_HANDLED') {
            // تم التعامل مع السؤال الغامض - لا شيء
            return;
        }
        throw error; // رمي الأخطاء الأخرى
    }
}

/**
 * 🎯 تصنيف النية (للتفاصيل)
 */
function classifyUserIntent(query) {
    const q = query.toLowerCase();
    
    if (q.includes('سند') || q.includes('قانون') || q.includes('تشريع')) 
        return 'legal';
    if (q.includes('ترخيص') || q.includes('رخصة') || q.includes('ورق')) 
        return 'license';
    if (q.includes('جهة') || q.includes('وزارة') || q.includes('مين')) 
        return 'authority';
    if (q.includes('مكان') || q.includes('موقع') || q.includes('فين')) 
        return 'location';
    if (q.includes('فني') || q.includes('ملاحظات') || q.includes('شروط')) 
        return 'technical';
    if (q.includes('104') || q.includes('قرار') || q.includes('حوافز')) 
        return 'decree';
    if (q.includes('دليل') || q.includes('ارشادات') || q.includes('جايد') || q.includes('guide')) 
        return 'guide';
    
    return 'general';
}

// ==================== 💎 محرك الردود ====================
function getLocalKnowledge(act, intent) {
    const data = act.details;
    const name = act.text;
    
    const responses = {
        legal: `السند التشريعي لنشاط ${name} هو: ${data.leg}`,
        
        license: `التراخيص المطلوبة لنشاط ${name} هي: ${data.req}`,
        
        technical: (() => {
            const notes = act.technicalNotes || 'لا توجد ملاحظات فنية متاحة';
            const short = notes.split('\n').slice(0, 2).join('. ');
            return `الملاحظات الفنية لنشاط ${name}: ${short}. التفاصيل الكاملة في اللوحة.`;
        })(),
        
        location: `الموقع المناسب لنشاط ${name} هو: ${data.loc}`,
        
        authority: `الجهة المختصة بإصدار تراخيص ${name} هي: ${data.auth}`,
        
        decree: (() => {
            const isIndustrial = name.includes('صناعي') || name.includes('إنتاج');
            return isIndustrial ? 
                `نعم، نشاط ${name} مخاطب بالقرار 104 لسنة 2022.` :
                `نشاط ${name} غير مدرج بشكل مباشر في القرار 104.`;
        })(),
        
        guide: (() => {
            if (data.guid && data.link) {
                return `دليل الإرشادات لنشاط ${name} هو: ${data.guid}. يمكنك الاطلاع عليه من الرابط المعروض في اللوحة.`;
            } else {
                return `عذراً، لا يوجد دليل إرشادات متاح حالياً لنشاط ${name}.`;
            }
        })(),
        
        general: `تم تحليل نشاط ${name}. اللوحة أمامك تُعرض كافة التفاصيل: التراخيص، الجهات، السند القانوني، والملاحظات الفنية.`
    };
    
    return responses[intent] || responses.general;
}

async function getRealAIResponse(query, act, intent) {
    // محاكاة استجابة AI (يمكن استبدالها بـ Gemini API حقيقي)
    return new Promise(resolve => {
        setTimeout(() => {
            const name = act.text;
            const context = `
المستخدم يسأل: ${query}
النشاط: ${name}
التفاصيل: ${JSON.stringify(act.details, null, 2)}
            `.trim();
            
            resolve(`بناءً على تحليلي لنشاط ${name}، ${getLocalKnowledge(act, intent)}`);
        }, 1200);
    });
}

// ==================== 🎨 واجهة الخيارات الذكية ====================
function showSmartChoices(searchResult) {
    const { bestMatch, alternatives, confidence, reasoning } = searchResult;
    
    const overlay = document.getElementById('expert-panel-overlay');
    const content = document.getElementById('expert-panel-content');
    
    overlay.style.display = 'block';
    
    const html = `
        <div class="p-3 bg-warning text-dark d-flex justify-content-between align-items-center">
            <h5 class="mb-0"><i class="fas fa-question-circle me-2"></i>وجدت عدة احتمالات</h5>
            <button onclick="closePanel()" class="btn-close"></button>
        </div>
        
        <div class="p-4">
            <div class="alert alert-info border-start border-4 border-info">
                <p class="mb-2"><strong>💡 التحليل:</strong> ${reasoning}</p>
                <p class="mb-0 small">الثقة: <strong>${(confidence * 100).toFixed(0)}%</strong></p>
            </div>
            
            <h6 class="fw-bold mb-3">أي من هذه الأنشطة تقصد؟</h6>
            
            <div class="best-choice-card mb-3 p-3 bg-light border border-success border-2 rounded-3 cursor-pointer" 
                 onclick="selectActivityFromChoice('${bestMatch.value}', '${bestMatch.text}')">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <span class="badge bg-success mb-2">⭐ الأقرب للمطلوب</span>
                        <h6 class="mb-1">${bestMatch.text}</h6>
                        <small class="text-muted">${bestMatch.reasoning || ''}</small>
                    </div>
                    <div class="text-end">
                        <div class="h4 mb-0 text-success">${Math.round(bestMatch.finalScore / 10)}%</div>
                        <small class="text-muted">تطابق</small>
                    </div>
                </div>
            </div>
            
            ${alternatives.length > 0 ? `
                <h6 class="text-muted mb-2 small">خيارات أخرى محتملة:</h6>
                <div class="alternatives-list">
                    ${alternatives.map((alt, i) => `
                        <div class="choice-item p-2 mb-2 border rounded-2 cursor-pointer hover-bg-light" 
                             onclick="selectActivityFromChoice('${alt.value}', '${alt.text}')">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="d-flex align-items-center gap-2">
                                    <span class="badge bg-secondary">${i + 2}</span>
                                    <span>${alt.text}</span>
                                </div>
                                <span class="text-muted small">${Math.round(alt.finalScore / 10)}%</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            <div class="mt-3 text-center">
                <button onclick="retryVoiceSearch()" class="btn btn-outline-primary">
                    <i class="fas fa-redo me-2"></i>أعد البحث بصوتك
                </button>
            </div>
        </div>
    `;
    
    content.innerHTML = html;
    
    // النطق الصوتي
    const alternativesCount = alternatives.length;
    const speechText = alternativesCount > 0 ?
        `وجدت ${alternativesCount + 1} احتمالات. الأقرب هو ${bestMatch.text}. قل رقم الخيار، أو اضغط على الخيار المطلوب.` :
        `أقرب نتيجة هي ${bestMatch.text}. هل هذا ما تقصده؟`;
    
    speak(speechText);
}

// ==================== 💡 واجهة الاقتراحات ====================
function showSmartSuggestions(searchResult, query) {
    const { suggestions } = searchResult;
    
    const overlay = document.getElementById('expert-panel-overlay');
    const content = document.getElementById('expert-panel-content');
    
    overlay.style.display = 'block';
    
    const hasSuggestions = suggestions && suggestions.length > 0;
    
    const html = `
        <div class="p-3 bg-danger text-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0"><i class="fas fa-exclamation-triangle me-2"></i>لم أجد تطابقاً دقيقاً</h5>
            <button onclick="closePanel()" class="btn-close btn-close-white"></button>
        </div>
        
        <div class="p-4">
            ${hasSuggestions ? `
                <div class="alert alert-warning border-start border-4 border-warning">
                    <p class="mb-0"><strong>🤔 ربما تقصد أحد هذه:</strong></p>
                </div>
                
                <div class="suggestions-list">
                    ${suggestions.slice(0, 3).map((s, i) => `
                        <div class="suggestion-card mb-3 p-3 border rounded-3 cursor-pointer hover-shadow" 
                             onclick="selectActivityFromChoice('${s.value}', '${s.text}')">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="d-flex align-items-center gap-3">
                                    <span class="suggestion-icon">${i === 0 ? '🎯' : '💡'}</span>
                                    <div>
                                        <h6 class="mb-0">${s.text}</h6>
                                        <small class="text-muted">تشابه لغوي مع بحثك</small>
                                    </div>
                                </div>
                                <span class="badge bg-info">${Math.round(s.similarity * 100)}%</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : `
                <div class="text-center py-4">
                    <div class="display-1 mb-3">😕</div>
                    <h5 class="mb-3">لم أجد أي نتيجة مطابقة</h5>
                    <p class="text-muted">حاول إعادة الصياغة بطريقة مختلفة</p>
                </div>
            `}
            
            <div class="search-tips mt-4 p-3 bg-light rounded-3">
                <h6 class="fw-bold mb-3"><i class="fas fa-lightbulb text-warning me-2"></i>نصائح البحث:</h6>
                <ul class="mb-0 small">
                    <li>استخدم كلمات بسيطة وواضحة (مثل: مخزن، مصنع، صيدلية)</li>
                    <li>تأكد من صحة الإملاء</li>
                    <li>جرب الكلمات بالعربية أو الإنجليزية</li>
                    <li>اذكر نوع النشاط بوضوح</li>
                </ul>
            </div>
            
            <div class="example-searches mt-3">
                <p class="small text-muted mb-2">أمثلة للبحث:</p>
                <div class="d-flex flex-wrap gap-2">
                    ${['تخزين وتبريد', 'مصنع أغذية', 'صيدلية', 'مطعم', 'فندق سياحي']
                        .map(ex => `
                            <span class="badge bg-secondary cursor-pointer" 
                                  onclick="searchExample('${ex}')">${ex}</span>
                        `).join('')}
                </div>
            </div>
            
            <div class="mt-4 text-center">
                <button onclick="retryVoiceSearch()" class="btn btn-primary">
                    <i class="fas fa-microphone me-2"></i>أعد البحث صوتياً
                </button>
            </div>
        </div>
    `;
    
    content.innerHTML = html;
    
    // النطق
    const speechText = hasSuggestions ?
        `لم أجد تطابقاً تاماً، لكن وجدت ${suggestions.length} اقتراحات مشابهة. أقربها هو ${suggestions[0].text}` :
        'عذراً، لم أجد أي نتائج. يرجى إعادة الصياغة بوضوح أكبر، أو اختر من الأمثلة المعروضة.';
    
    speak(speechText);
}

// ==================== 📊 لوحة المعلومات الاحترافية ====================
function showExpertDashboard(activity, intent, aiSpeech, searchResult = null) {
    const overlay = document.getElementById('expert-panel-overlay');
    const content = document.getElementById('expert-panel-content');
    
    overlay.style.display = 'block';
    
    const isGeneral = intent === 'general';
    const details = activity.details;
    
    // بناء شارة الثقة
    const confidenceBadge = searchResult ? `
        <div class="confidence-indicator d-inline-block ms-2">
            <span class="badge ${searchResult.confidence > 0.85 ? 'bg-success' : 'bg-warning'}">
                ثقة ${(searchResult.confidence * 100).toFixed(0)}%
            </span>
        </div>
    ` : '';
    
    const html = `
        <div class="p-3 bg-primary text-white d-flex justify-content-between align-items-center">
            <div>
                <h5 class="mb-0">
                    <i class="fas fa-shield-alt me-2"></i>
                    ${activity.text}
                    ${confidenceBadge}
                </h5>
            </div>
            <button onclick="closePanel()" class="btn-close btn-close-white"></button>
        </div>
        
        <div class="p-4 bg-light">
            <!-- رد الذكاء الاصطناعي -->
            <div class="alert alert-primary border-start border-4 border-primary shadow-sm mb-4">
                <div class="d-flex align-items-start gap-2">
                    <i class="fas fa-robot text-primary" style="font-size:1.5rem;"></i>
                    <p class="mb-0 fw-bold" style="line-height:1.6;">${aiSpeech}</p>
                </div>
            </div>
            
            <!-- معلومات السياق -->
            ${searchResult ? `
                <div class="context-info mb-3 p-2 bg-white rounded-2 border">
                    <small class="text-muted">
                        <i class="fas fa-brain me-1"></i>
                        ${searchResult.reasoning}
                        ${searchResult.queryIntent?.category ? 
                            ` • النية المكتشفة: <strong>${searchResult.queryIntent.category}</strong>` : ''}
                    </small>
                </div>
            ` : ''}
            
            <!-- البطاقات المعلوماتية -->
            <div class="row g-3">
                ${(isGeneral || intent === 'license') ? 
                    renderInfoCard('التراخيص المطلوبة', details.req, 'fa-file-invoice', 'primary') : ''}
                
                ${(isGeneral || intent === 'authority') ? 
                    renderInfoCard('الجهات المختصة', details.auth, 'fa-landmark', 'success') : ''}
                
                ${(isGeneral || intent === 'legal') ? 
                    renderInfoCard('السند القانوني للتراخيص المطلوبة', details.leg, 'fa-gavel', 'dark') : ''}
                
                ${(isGeneral || intent === 'location') ? 
                    renderInfoCard('الموقع الملائم', details.loc, 'fa-map-pin', 'info') : ''}
                
                ${(isGeneral || intent === 'technical') ? 
                    renderInfoCard('الدليل الفني لفريق لجنة المعاينة', activity.technicalNotes || 'لا توجد ملاحظات', 
                        'fa-clipboard-check', 'warning') : ''}
                
                ${(isGeneral || intent === 'decree') ? 
                    renderInfoCard('الحوافز والقرارات', 
                        activity.text.includes('صناعي') ? 
                            'مخاطب بالقرار 104 لسنة 2022' : 
                            'غير مدرج في القرار 104 حالياً',
                        'fa-percentage', 'danger') : ''}
                
                ${((isGeneral || intent === 'guide') && details.guid && details.link) ? `
                    <div class="col-12">
                        <div class="guide-card position-relative overflow-hidden" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px; box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);">
                            <div class="card-body p-4">
                                <div class="d-flex align-items-center justify-content-between mb-3">
                                    <div class="d-flex align-items-center gap-3">
                                        <div class="guide-icon" style="width: 50px; height: 50px; background: rgba(255,255,255,0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                            <i class="fas fa-book-open text-white" style="font-size: 24px;"></i>
                                        </div>
                                        <div class="text-white">
                                            <div class="small opacity-75 mb-1">📋 المرجع الرسمي</div>
                                            <h5 class="mb-0 fw-bold">${details.guid}</h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex gap-2 mt-3">
                                    <a href="${details.link}" target="_blank" class="btn btn-light flex-grow-1" style="border-radius: 10px; font-weight: 600;">
                                        <i class="fas fa-external-link-alt me-2"></i>فتح الدليل
                                    </a>
                                    <button onclick="copyGuideLink('${details.link}')" class="btn btn-outline-light" style="border-radius: 10px;" title="نسخ الرابط">
                                        <i class="fas fa-copy"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="position-absolute" style="top: -20px; right: -20px; width: 120px; height: 120px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                            <div class="position-absolute" style="bottom: -30px; left: -30px; width: 150px; height: 150px; background: rgba(255,255,255,0.08); border-radius: 50%;"></div>
                        </div>
                    </div>
                ` : ''}
            </div>
            
            <!-- الإجراءات -->
            <div class="mt-4 d-flex gap-2 justify-content-center flex-wrap">
                <button onclick="askMoreDetails()" class="btn btn-outline-primary">
                    <i class="fas fa-question-circle me-2"></i>اسأل المزيد
                </button>
                <button onclick="clearContextAndSearch()" class="btn btn-outline-secondary">
                    <i class="fas fa-search me-2"></i>بحث جديد
                </button>
                <button onclick="closePanel()" class="btn btn-secondary">
                    <i class="fas fa-times me-2"></i>إغلاق
                </button>
            </div>
        </div>
    `;
    
    content.innerHTML = html;
}

function renderInfoCard(title, body, icon, color) {
    return `
        <div class="col-md-6">
            <div class="card h-100 border-0 shadow-sm hover-lift">
                <div class="card-body">
                    <h6 class="text-${color} fw-bold mb-3">
                        <i class="fas ${icon} me-2"></i>${title}
                    </h6>
                    <div class="small text-muted" style="white-space:pre-line; max-height:200px; overflow-y:auto; line-height:1.6;">
                        ${body}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ==================== 🔊 محرك النطق ====================
/**
 * 🔊 محرك النطق الذكي متعدد اللغات
 */
function speak(text) {
    window.speechSynthesis.cancel();
    
    // 🌍 كشف اللغة وتقسيم النص
    const segments = detectAndSegmentLanguages(text);
    
    console.log('🗣️ نطق متعدد اللغات:', segments);
    
    // نطق كل جزء بلغته
    segments.forEach((segment, index) => {
        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(segment.text);
            
            // تحديد اللغة والصوت المناسب
            if (segment.lang === 'en') {
                utterance.lang = 'en-US';
                utterance.rate = 0.95;
                utterance.pitch = 1.0;
                
                // محاولة اختيار صوت إنجليزي طبيعي
                const voices = window.speechSynthesis.getVoices();
                const enVoice = voices.find(v => 
                    v.lang.startsWith('en') && 
                    (v.name.includes('Google') || v.name.includes('Microsoft'))
                );
                if (enVoice) utterance.voice = enVoice;
                
            } else {
                utterance.lang = 'ar-SA'; // استخدام ar-SA للوضوح
                utterance.rate = 1.0;
                utterance.pitch = 1.0;
                
                // محاولة اختيار صوت عربي طبيعي
                const voices = window.speechSynthesis.getVoices();
                const arVoice = voices.find(v => 
                    v.lang.startsWith('ar') && 
                    (v.name.includes('Google') || v.name.includes('Microsoft'))
                );
                if (arVoice) utterance.voice = arVoice;
            }
            
            window.speechSynthesis.speak(utterance);
        }, index * 100); // تأخير بسيط بين الأجزاء
    });
}

/**
 * 🔍 كاشف ومقسّم اللغات في النص
 */
function detectAndSegmentLanguages(text) {
    const segments = [];
    let currentSegment = { text: '', lang: null };
    
    // تقسيم إلى كلمات
    const words = text.split(/(\s+)/); // الحفاظ على المسافات
    
    words.forEach(word => {
        const wordLang = detectWordLanguage(word.trim());
        
        if (!currentSegment.lang) {
            // بداية جديدة
            currentSegment.lang = wordLang;
            currentSegment.text = word;
        } else if (currentSegment.lang === wordLang || !word.trim()) {
            // نفس اللغة أو مسافة
            currentSegment.text += word;
        } else {
            // لغة مختلفة - حفظ الجزء الحالي وبدء جديد
            if (currentSegment.text.trim()) {
                segments.push({ ...currentSegment });
            }
            currentSegment = { text: word, lang: wordLang };
        }
    });
    
    // إضافة آخر جزء
    if (currentSegment.text.trim()) {
        segments.push(currentSegment);
    }
    
    // دمج الأجزاء الصغيرة جداً مع ما قبلها
    return mergeSmallSegments(segments);
}

/**
 * 🔬 كشف لغة الكلمة
 */
function detectWordLanguage(word) {
    if (!word) return 'ar';
    
    // فحص الأحرف العربية
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    
    // فحص الأحرف الإنجليزية
    const englishPattern = /[A-Za-z]/;
    
    if (arabicPattern.test(word)) {
        return 'ar';
    } else if (englishPattern.test(word)) {
        return 'en';
    }
    
    return 'ar'; // افتراضي
}

/**
 * 🔗 دمج الأجزاء الصغيرة
 */
function mergeSmallSegments(segments) {
    const merged = [];
    let i = 0;
    
    while (i < segments.length) {
        const segment = segments[i];
        
        // إذا كان الجزء صغير جداً (كلمة واحدة أو اثنتين)
        if (segment.text.trim().split(/\s+/).length <= 2 && merged.length > 0) {
            // دمج مع الجزء السابق
            merged[merged.length - 1].text += ' ' + segment.text;
        } else {
            merged.push(segment);
        }
        
        i++;
    }
    
    return merged;
}

function toggleLoader(show) {
    const loader = document.getElementById('ai-loader');
    if (loader) loader.style.display = show ? 'block' : 'none';
}

// ==================== 🎬 دوال المساعدة ====================
function selectActivityFromChoice(value, text) {
    console.log('✅ اختيار من الخيارات:', text);
    
    // البحث عن النشاط الكامل
    const activity = masterActivityDB.find(a => a.value === value);
    
    if (activity) {
        ContextEngine.updateContext(activity, text, 'general');
        
        // إعادة المعالجة
        const intent = 'general';
        const responseText = getLocalKnowledge(activity, intent);
        
        speak(`تم الاختيار: ${text}. ${responseText}`);
        showExpertDashboard(activity, intent, responseText);
    }
}

function searchExample(example) {
    console.log('🔍 بحث بالمثال:', example);
    const searchInput = document.getElementById('activitySearchInput');
    if (searchInput) {
        searchInput.value = example;
        searchInput.dispatchEvent(new Event('input'));
    }
    closePanel();
    handleIntelligence(example);
}

function retryVoiceSearch() {
    closePanel();
    try {
        if (recognition) recognition.start();
    } catch (e) {
        console.error('خطأ في بدء التعرف الصوتي:', e);
    }
}

function askMoreDetails() {
    closePanel();
    
    // رسائل متنوعة حسب عدد مرات الاستخدام
    const messages = [
        'ما الذي تريد معرفته بالتحديد عن هذا النشاط؟ يمكنك السؤال عن التراخيص، الموقع، الجهات، الملاحظات الفنية، أو الدليل الإرشادي.',
        'تَفضل، أنا جاهز للإجابة على أي استفسار آخر.',
        'نعم، ما سؤالك؟',
        'أنا في الخدمة، اسأل ما تشاء.',
        'تفضل، ماذا تريد أن تعرف أيضاً؟',
        'أي معلومة أخرى تحتاجها؟'
    ];
    
    // حساب عدد مرات الاستخدام في هذه الجلسة
    if (!window.askMoreDetailsCount) {
        window.askMoreDetailsCount = 0;
    }
    
    const messageIndex = Math.min(window.askMoreDetailsCount, messages.length - 1);
    speak(messages[messageIndex]);
    
    window.askMoreDetailsCount++;
    
    try {
        if (recognition) recognition.start();
    } catch (e) {}
}

function clearContextAndSearch() {
    ContextEngine.clearContext();
    closePanel();
    speak('تم مسح السياق. ابدأ بحثاً جديداً.');
}

function closePanel() {
    const overlay = document.getElementById('expert-panel-overlay');
    if (overlay) overlay.style.display = 'none';
}

function copyGuideLink(link) {
    navigator.clipboard.writeText(link).then(() => {
        speak('تم نسخ رابط الدليل بنجاح');
        // عرض رسالة مؤقتة
        const btn = event.target.closest('button');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.classList.add('btn-success');
        btn.classList.remove('btn-outline-light');
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.classList.remove('btn-success');
            btn.classList.add('btn-outline-light');
        }, 2000);
    }).catch(() => {
        speak('عذراً، حدث خطأ في النسخ');
    });
}

// ==================== 🎨 واجهة المستخدم ====================
const cleanupOldUI = () => {
    const oldWrapper = document.getElementById('voice-agent-wrapper');
    if (oldWrapper) oldWrapper.style.display = 'none';
};

const createFloatingUI = () => {
    cleanupOldUI();
    
    const styles = `
        <style>
            .ai-floating-btn {
                position: fixed; z-index: 1000000;
                display: flex; align-items: center; justify-content: center;
                color: white; cursor: move; 
                border: 2px solid rgba(255,255,255,0.4);
                box-shadow: 0 5px 20px rgba(0,0,0,0.4); 
                touch-action: none; transition: transform 0.2s;
            }
            #mic-btn {
                width: 60px; height: 60px;
                background: linear-gradient(135deg, #0d6efd, #0a58ca);
                border-radius: 50%; bottom: 100px; left: 20px;
            }
            #speaker-btn {
                width: 45px; height: 45px;
                background: linear-gradient(135deg, #6c757d, #343a40);
                border-radius: 50%; bottom: 170px; left: 27px;
            }
            .mic-active {
                animation: ai-pulse 1.5s infinite;
                background: linear-gradient(135deg, #dc3545, #bb2d3b) !important;
            }
            @keyframes ai-pulse {
                0% { box-shadow: 0 0 0 0 rgba(220,53,69,0.7); }
                70% { box-shadow: 0 0 0 20px rgba(220,53,69,0); }
                100% { box-shadow: 0 0 0 0 rgba(220,53,69,0); }
            }
            .cursor-pointer { cursor: pointer; }
            .hover-bg-light:hover { background-color: #f8f9fa; }
            .hover-shadow:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
            .hover-lift { transition: transform 0.2s; }
            .hover-lift:hover { transform: translateY(-4px); }
            #expert-panel-overlay { 
                direction: rtl; 
                text-align: right; 
            }
/* تحسينات شاملة للموبايل - جميع الشاشات حتى 768px */
            @media (max-width: 768px) {
                #expert-panel-overlay {
                    padding: 8px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }
                
                #expert-panel-content { 
                    width: 100% !important;
                    max-width: 100% !important;
                    max-height: 92vh !important;
                    overflow-y: auto !important;
                    margin: 0 !important;
                    border-radius: 15px !important;
                }
                
                .col-md-6 { 
                    width: 100% !important; 
                    margin-bottom: 0.75rem !important;
                }
                
                .row.g-3 {
                    gap: 0.75rem !important;
                }
                
                #mic-btn { 
                    width: 55px !important; 
                    height: 55px !important; 
                    bottom: 80px !important; 
                    left: 15px !important; 
                }
                
                #speaker-btn { 
                    width: 40px !important; 
                    height: 40px !important; 
                    bottom: 145px !important; 
                    left: 22px !important; 
                }
                
                .card-body { 
                    font-size: 0.9rem !important; 
                    padding: 0.75rem !important;
                    max-height: none !important;
                }
                
                .alert { 
                    font-size: 0.95rem !important; 
                    padding: 0.75rem !important;
                    margin-bottom: 0.75rem !important;
                }
                
                .guide-card .card-body {
                    padding: 1rem !important;
                }
                
                .guide-icon {
                    width: 40px !important;
                    height: 40px !important;
                }
                
                .guide-card h5 {
                    font-size: 0.95rem !important;
                }
                
                .btn {
                    font-size: 0.85rem !important;
                    padding: 0.4rem 0.8rem !important;
                }
                
                .choice-item, .suggestion-card {
                    padding: 0.75rem !important;
                    font-size: 0.9rem !important;
                }
                
                .alternatives-list .badge {
                    font-size: 0.7rem !important;
                }
                
                .p-4 {
                    padding: 1.25rem !important;
                }
                
                .p-3 {
                    padding: 1rem !important;
                }
                
                h5 {
                    font-size: 1.1rem !important;
                }
                
                h6 {
                    font-size: 0.95rem !important;
                }
                
                .container {
                    padding: 0 !important;
                }
            }     
      </style>
    `;
    
    const html = `
        <div id="mic-btn" class="ai-floating-btn draggable-ai">
            <i class="fas fa-microphone" style="font-size:24px;"></i>
        </div>
        <div id="speaker-btn" class="ai-floating-btn draggable-ai">
            <i class="fas fa-volume-up"></i>
        </div>
        <div id="ai-loader" style="display:none; position:fixed; bottom:30px; left:50%; transform:translateX(-50%); background:white; padding:12px 25px; border-radius:50px; z-index:1000001; border:2px solid #0d6efd; box-shadow:0 5px 20px rgba(0,0,0,0.2);">
            <div class="d-flex align-items-center gap-2">
                <div class="spinner-border text-primary spinner-border-sm"></div>
                <span class="fw-bold">🧠 يتم التحليل الذكي...</span>
            </div>
        </div>
        <div id="expert-panel-overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); backdrop-filter:blur(10px); z-index:9999999; overflow-y:auto; padding:15px;">
            <div class="container py-3">
                <div id="expert-panel-content" class="bg-white rounded-4 shadow-lg overflow-hidden" style="max-width:900px; margin:auto;"></div>
            </div>
        </div>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
    document.body.insertAdjacentHTML('beforeend', html);
    
    setupDraggable();
};

function setupDraggable() {
    document.querySelectorAll('.draggable-ai').forEach(el => {
        let isDragging = false, currentX, currentY, initialX, initialY;
        let xOffset = 0, yOffset = 0;
        
        const dragStart = (e) => {
            initialX = (e.type === "touchstart" ? e.touches[0].clientX : e.clientX) - xOffset;
            initialY = (e.type === "touchstart" ? e.touches[0].clientY : e.clientY) - yOffset;
            if (e.target === el || el.contains(e.target)) isDragging = true;
        };
        
        const drag = (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = (e.type === "touchmove" ? e.touches[0].clientX : e.clientX) - initialX;
                currentY = (e.type === "touchmove" ? e.touches[0].clientY : e.clientY) - initialY;
                xOffset = currentX;
                yOffset = currentY;
                el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
            }
        };
        
        const dragEnd = () => isDragging = false;
        
        el.addEventListener("touchstart", dragStart);
        el.addEventListener("touchend", dragEnd);
        el.addEventListener("touchmove", drag);
        el.addEventListener("mousedown", dragStart);
        el.addEventListener("mouseup", dragEnd);
        el.addEventListener("mousemove", drag);
    });
}

// ==================== 🚀 التهيئة والتشغيل ====================
let recognition;

function initSpeechEngine() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.error('❌ التعرف الصوتي غير مدعوم في هذا المتصفح');
        return;
    }
    
    recognition = new SpeechRecognition();
    recognition.lang = 'ar-EG';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => {
        console.log('🎤 بدء الاستماع...');
        document.getElementById('mic-btn').classList.add('mic-active');
    };
    
    recognition.onend = () => {
        console.log('🎤 انتهى الاستماع');
        document.getElementById('mic-btn').classList.remove('mic-active');
    };
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('📝 تم التعرف:', transcript);
        handleIntelligence(transcript);
    };
    
    recognition.onerror = (event) => {
        console.error('❌ خطأ في التعرف الصوتي:', event.error);
        document.getElementById('mic-btn').classList.remove('mic-active');
        
        if (event.error === 'no-speech') {
            speak('لم أسمع أي شيء. حاول مرة أخرى.');
        }
    };
}

// ==================== 🎬 بدء التطبيق ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 VoiceAgent Pro v4.0 - التهيئة...');
// 🔊 تحميل الأصوات المتاحة
    if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
            const voices = window.speechSynthesis.getVoices();
            console.log('🗣️ الأصوات المتاحة:', voices.length);
            voices.forEach(v => {
                if (v.lang.startsWith('ar') || v.lang.startsWith('en')) {
                    console.log(`  - ${v.name} (${v.lang})`);
                }
            });
        };
        // تحميل فوري
        window.speechSynthesis.getVoices();
    }
    
    // التحقق من وجود NeuralSearch
    if (typeof window.NeuralSearch !== 'function') {
        console.error('❌ NeuralSearch غير محمّل! تأكد من تضمين neural_search_v6.js');
        alert('خطأ: محرك البحث غير محمّل. تأكد من تضمين neural_search_v6.js');
        return;
    }
    
    // التحقق من قاعدة البيانات
    if (typeof masterActivityDB === 'undefined' || !masterActivityDB.length) {
        console.error('❌ masterActivityDB غير موجودة!');
        alert('خطأ: قاعدة بيانات الأنشطة غير محمّلة');
        return;
    }
    
    console.log('✅ NeuralSearch محمّل بنجاح');
    console.log('✅ قاعدة البيانات:', masterActivityDB.length, 'نشاط');
    
    // إنشاء الواجهة
    createFloatingUI();
    
    // تهيئة محرك النطق
    initSpeechEngine();
    
    // ربط الأزرار
    const micBtn = document.getElementById('mic-btn');
    const speakerBtn = document.getElementById('speaker-btn');
    
    if (micBtn) {
        micBtn.onclick = () => {
            try {
                recognition.start();
            } catch (e) {
                console.warn('⚠️ محاولة بدء التعرف أثناء التشغيل');
            }
        };
    }
    
    if (speakerBtn) {
        speakerBtn.onclick = () => {
            window.speechSynthesis.cancel();
            console.log('🔇 تم إيقاف النطق');
        };
    }
    
    console.log('✅ VoiceAgent Pro جاهز للعمل! 🎉');
    
    // رسالة ترحيبية
    setTimeout(() => {
        speak('مَرحباً! أنا مساعدك المتخصص في اللجان. اضغط على زر الميكروفون واسألني عن أي نشاط.');
    }, 1000);
});
