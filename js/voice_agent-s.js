/**
 * 🧠 VoiceAgent Pro v4.1 - المساعد الذكي المتكامل
 * نسخة محسنة مع حلول جميع المشكلات المذكورة
 */

// ==================== 🧠 حالة الذكاء الاصطناعي ====================
const AI_STATE = {
    apiKey: " ",
    conversationHistory: [],
    maxHistory: 30,
    currentActivity: null,
    lastIntent: 'general',
    userPreferences: new Map(),
    sessionStart: Date.now(),
    isMobile: false,
    isSpeaking: false // ✅ تتبع حالة النطق
};

// ==================== 📱 كشف الجهاز وتطبيق الأنماط ====================
function detectDeviceAndApplyStyles() {
    const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone/i.test(navigator.userAgent);
    const isSmallScreen = window.innerWidth < 768;
    
    AI_STATE.isMobile = isMobile || isSmallScreen;
    
    console.log(`📱 كشف الجهاز: ${AI_STATE.isMobile ? 'موبايل' : 'كمبيوتر'}`);
    
    if (AI_STATE.isMobile) {
        applyMobileStyles();
    } else {
        applyDesktopStyles();
    }
}

// ✅ تحسين خلفية الجوال لتكون أكثر وضوحاً
function applyMobileStyles() {
    const style = document.createElement('style');
    style.id = 'mobile-styles';
    style.textContent = `
        /* تحسينات شاملة للجوال */
        #expert-panel-overlay {
            padding: 0 !important;
            backdrop-filter: blur(15px) !important;
            -webkit-backdrop-filter: blur(15px) !important;
            background: rgba(0, 0, 0, 0.75) !important; /* ✅ تعديل الشفافية */
        }
        
        #expert-panel-content {
            width: 100% !important;
            max-width: 100% !important;
            height: 100vh !important;
            max-height: 100vh !important;
            margin: 0 !important;
            border-radius: 0 !important;
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch !important;
            background: #ffffff !important; /* ✅ خلفية بيضاء للنص */
        }
        
        .mobile-scroll-container {
            height: calc(100vh - 60px);
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 120px !important; /* ✅ زيادة المساحة السفلية */
        }
        
        .mobile-header {
            position: sticky;
            top: 0;
            z-index: 1000;
            min-height: 60px;
            display: flex;
            align-items: center;
            background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%) !important;
        }
        
        .mobile-content {
            padding: 1rem;
            padding-bottom: 140px !important; /* ✅ مساحة كافية للأزرار */
        }
        
        .mobile-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: white;
            border-top: 1px solid #dee2e6;
            padding: 15px;
            z-index: 1001;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
        }
        
        .card-mobile {
            border-radius: 12px;
            margin-bottom: 1rem;
            border: 1px solid #e9ecef;
            background: white !important;
            color: #212529 !important; /* ✅ نص غامق للقراءة */
        }
        
        .btn-mobile {
            min-height: 48px;
            font-size: 1rem;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
        }
        
        .text-truncate-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        
        .icon-circle {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        
        /* ✅ تحسين تباين النصوص */
        .text-dark {
            color: #212529 !important;
        }
        
        .text-muted {
            color: #6c757d !important;
        }
        
        .alert {
            background-color: rgba(13, 110, 253, 0.1) !important;
            border-color: rgba(13, 110, 253, 0.2) !important;
            color: #212529 !important;
        }
        
        /* ✅ تحسين رؤية الروابط */
        a {
            color: #0d6efd !important;
            text-decoration: underline;
        }
        
        /* ✅ تحسين رؤية الأزرار */
        .btn-primary {
            background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%) !important;
            border: none !important;
            color: white !important;
        }
        
        .btn-outline-primary {
            color: #0d6efd !important;
            border-color: #0d6efd !important;
        }
        
        @media (max-width: 360px) {
            .mobile-content {
                padding: 0.75rem;
                padding-bottom: 130px !important;
            }
            
            .btn-mobile {
                min-height: 44px;
                font-size: 0.9rem;
            }
            
            .mobile-footer {
                padding: 10px;
            }
        }
        
        @media (max-height: 500px) and (orientation: landscape) {
            .mobile-scroll-container {
                height: calc(100vh - 50px);
            }
            
            .mobile-header {
                min-height: 50px;
            }
            
            .mobile-content {
                padding-bottom: 80px !important;
            }
        }
        
        /* دعم الشقوق في الهواتف الحديثة */
        @supports (padding-top: env(safe-area-inset-top)) {
            #expert-panel-content {
                padding-top: env(safe-area-inset-top);
                padding-bottom: calc(env(safe-area-inset-bottom) + 80px);
            }
            
            .mobile-footer {
                padding-bottom: calc(15px + env(safe-area-inset-bottom));
            }
        }
    `;
    
    // إزالة الأنماط القديمة إذا كانت موجودة
    const oldStyle = document.getElementById('mobile-styles');
    if (oldStyle) oldStyle.remove();
    
    document.head.appendChild(style);
}

function applyDesktopStyles() {
    const style = document.createElement('style');
    style.id = 'desktop-styles';
    style.textContent = `
        #expert-panel-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.75); /* ✅ تعديل الشفافية */
            backdrop-filter: blur(10px);
            z-index: 9999999;
            overflow-y: auto;
            padding: 20px;
        }
        
        #expert-panel-content {
            background: white;
            border-radius: 20px;
            box-shadow: 0 25px 50px rgba(0,0,0,0.3);
            max-width: 900px;
            margin: auto;
            overflow: hidden;
            max-height: 90vh;
            overflow-y: auto;
            color: #212529; /* ✅ نص غامق */
        }
        
        .desktop-card {
            transition: transform 0.3s, box-shadow 0.3s;
            border-radius: 15px;
            overflow: hidden;
            background: white !important;
        }
        
        .desktop-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
        
        .desktop-btn {
            padding: 10px 25px;
            border-radius: 10px;
            font-weight: 600;
            transition: all 0.3s;
        }
        
        .desktop-btn:hover {
            transform: scale(1.05);
        }
        
        /* ✅ تحسين التباين للكمبيوتر */
        .text-dark {
            color: #212529 !important;
        }
        
        .text-muted {
            color: #6c757d !important;
        }
        
        @media (max-width: 1200px) {
            #expert-panel-content {
                max-width: 95%;
            }
        }
    `;
    
    const oldStyle = document.getElementById('desktop-styles');
    if (oldStyle) oldStyle.remove();
    
    document.head.appendChild(style);
}

// ==================== 🎯 طبقة الذكاء الصوتي ====================
const VoiceIntelligence = {
    smartSearch(query, options = {}) {
        const {
            useContext = true,
            minConfidence = 'auto',
            maxResults = 5,
            respectIntent = true
        } = options;
        
        console.log('🧠 بدء البحث الذكي:', { query, useContext });
        
        const rawResults = window.NeuralSearch(query, masterActivityDB);
        const analyzed = this.analyzeResults(rawResults, query, options);
        this.logSearch(query, analyzed);
        
        return analyzed;
    },
    
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
        
        const queryIntent = this.detectQueryIntent(query);
        const filtered = this.intelligentFilter(results, query, queryIntent);
        const contextSorted = this.contextualSort(filtered, queryIntent);
        const confidence = this.calculateConfidence(contextSorted, query, stats, queryIntent);
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
    
    calculateConfidence(results, query, stats, queryIntent) {
        if (!results || results.length === 0) return 0;
        
        const top = results[0];
        const queryWords = query.trim().split(/\s+/).length;
        
        const factors = {
            scoreBase: Math.min(top.finalScore / 1000, 1) * 0.4,
            semantic: Math.min((top.semanticScore || 0) / 5, 1) * 0.2,
            matchDiversity: Math.min((top.matchTypes || 1) / 6, 1) * 0.15,
            queryClarity: (queryWords >= 2 && queryWords <= 5 ? 1 : 0.7) * 0.1,
            gap: results.length > 1 ? 
                Math.min((top.finalScore - results[1].finalScore) / 500, 1) * 0.1 : 0.1,
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
    
    detectQueryIntent(query) {
        const normalized = query.toLowerCase().trim();
        
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
    
    intelligentFilter(results, query, queryIntent) {
        if (!queryIntent.conflicts || queryIntent.conflicts.length === 0) {
            return results;
        }
        
        const filtered = results.filter(activity => {
            const activityText = [
                activity.text,
                ...(activity.keywords || []),
                ...(activity.synonyms || []),
                activity.details?.act || ''
            ].join(' ').toLowerCase();
            
            const hasConflict = queryIntent.conflicts.some(conflict => 
                activityText.includes(conflict.toLowerCase())
            );
            
            if (hasConflict && activity.finalScore < 400) {
                console.log('🚫 استبعاد:', activity.text, '- تعارض مع النية');
                return false;
            }
            
            return true;
        });
        
        console.log(`🔬 تصفية: ${results.length} → ${filtered.length} نتيجة`);
        return filtered;
    },
    
    contextualSort(results, queryIntent) {
        if (!queryIntent.boost || queryIntent.boost === 1.0) {
            return results;
        }
        
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
    analyzeContext(query) {
        const normalized = query.toLowerCase().trim();
        
        const detailTriggers = [
            'موقع', 'مكان', 'فين', 'أين', 'اين',
            'سند', 'قانون', 'تشريع', 'قرار',
            'ترخيص', 'رخصة', 'ورق', 'مستندات',
            'ملاحظات', 'فني', 'تقني', 'شروط',
            'جهة', 'مين', 'وزارة', 'هيئة',
            '104', 'لائحة', 'اشتراطات',
            'دليل', 'ارشادات', 'جايد', 'guide'
        ];
        
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
    
    updateContext(activity, query, intent) {
        AI_STATE.currentActivity = activity;
        AI_STATE.lastIntent = intent;
        
        AI_STATE.conversationHistory.push({
            timestamp: Date.now(),
            query: query,
            activity: activity?.text,
            intent: intent
        });
        
        if (AI_STATE.conversationHistory.length > AI_STATE.maxHistory) {
            AI_STATE.conversationHistory.shift();
        }
        
        console.log('🔄 تحديث السياق:', {
            activity: activity?.text,
            historySize: AI_STATE.conversationHistory.length
        });
    },
    
    clearContext() {
        AI_STATE.currentActivity = null;
        AI_STATE.lastIntent = 'general';
        console.log('🧹 تم مسح السياق');
    }
};

// ==================== 🔄 معالج الأسئلة الغامضة ====================
function preprocessVagueQuery(query) {
    const normalized = query.toLowerCase().trim();
    
    const vaguePatterns = [
        {
            pattern: /^(عاوز|عايز|اريد|ابغى|ممكن|نفسي|احب)\s+(اعرف|معرفة|افهم|تقولي|تقول لي|تفهمني)/i,
            action: () => {
                speak('طبعاً! اسأل عن أي نشاط تريد معرفة تفاصيله، مثل: مصنع، مطعم، صيدلية، مخزن، أو أي نشاط آخر.');
                return null;
            }
        },
        {
            pattern: /^(ازاي|ازى|كيف|how)\s+(اعمل|انشئ|افتح|ابدأ)?$/i,
            action: () => {
                speak('أخبرني عن النشاط الذي تريد معرفة كيفية إنشائه، مثل: كيف أفتح مطعم؟ أو كيف أبدأ مصنع؟');
                return null;
            }
        },
        {
            pattern: /^(ايه|اية|ايش|وش|ما هو|ما هي|what is)\s*(ال)?$/i,
            action: () => {
                speak('ما الذي تريد معرفته بالتحديد؟ اذكر اسم النشاط أو نوعه.');
                return null;
            }
        },
        {
            pattern: /^(فين|فيين|وين|وينه|أين|اين|where)\s*(ال)?$/i,
            action: () => {
                speak('أي نشاط تبحث عن موقعه؟ مثل: فين أفتح مخزن تبريد؟');
                return null;
            }
        },
        {
            pattern: /(عاوز|اريد|ممكن|نفسي).+(اعرف|افهم|معرفة)\s+(.+)/i,
            action: (match) => {
                const extracted = match[3].trim();
                console.log('🔄 استخراج نشاط من سؤال غامض:', extracted);
                return extracted;
            }
        },
        {
            pattern: /(ازاي|كيف|how).+(اعمل|افتح|ابدأ|انشئ)\s+(.+)/i,
            action: (match) => {
                const extracted = match[3].trim();
                console.log('🔄 استخراج من سؤال "كيف":', extracted);
                return extracted;
            }
        },
        {
            pattern: /(عاوز|عايز|اريد|ممكن)\s+(افتح|اعمل|ابدأ)\s+(.+)/i,
            action: (match) => {
                const extracted = match[3].trim();
                console.log('🔄 استخراج من "عايز افتح":', extracted);
                return extracted;
            }
        }
    ];
    
    for (const {pattern, action} of vaguePatterns) {
        const match = normalized.match(pattern);
        if (match) {
            const result = action(match);
            if (result === null) {
                throw new Error('VAGUE_QUERY_HANDLED');
            }
            return result;
        }
    }
    
    return query;
}

// ==================== 🎙️ المحرك الرئيسي للمعالجة ====================
async function handleIntelligence(query) {
    console.log('💬 استعلام جديد:', query);
    
    try {
        const processedQuery = preprocessVagueQuery(query);
        const context = ContextEngine.analyzeContext(processedQuery);
        
        let activity = null;
        let searchResult = null;
        
        if (context.shouldUseCurrentActivity) {
            activity = context.currentActivity;
            console.log('♻️ استخدام النشاط من الذاكرة:', activity.text);
        } else {
            searchResult = VoiceIntelligence.smartSearch(query, {
                useContext: true,
                maxResults: 5,
                respectIntent: true
            });
            
            if (searchResult.confidence >= 0.85) {
                activity = searchResult.bestMatch;
                ContextEngine.updateContext(activity, query, 'general');
                console.log('✅ ثقة عالية - تنفيذ مباشر:', activity.text);
            } else if (searchResult.confidence >= 0.5) {
                console.log('🤔 ثقة متوسطة - عرض خيارات');
                showSmartChoices(searchResult);
                return;
            } else {
                console.log('❌ ثقة منخفضة - عرض اقتراحات');
                showSmartSuggestions(searchResult, query);
                return;
            }
        }
        
        if (!activity) {
            speak('عذراً، لم أستطع تحديد النشاط بدقة. يرجى إعادة الصياغة بوضوح أكبر.');
            return;
        }
        
        const userIntent = classifyUserIntent(query);
        
        let responseText = "";
        if (window.SESSION_AI_ENABLED) {
            toggleLoader(true);
            responseText = await getRealAIResponse(query, activity, userIntent);
            toggleLoader(false);
        } else {
            responseText = getLocalKnowledge(activity, userIntent);
        }
        
        speak(responseText, () => {
            // ✅ دالة رد النداء تنفذ بعد انتهاء النطق
            console.log('✅ تم إنهاء النطق بنجاح');
        });
        
        showExpertDashboard(activity, userIntent, responseText, searchResult);
        
    } catch (error) {
        if (error.message === 'VAGUE_QUERY_HANDLED') {
            return;
        }
        throw error;
    }
}

// ==================== 🎯 تصنيف النية ====================
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
    return new Promise(resolve => {
        setTimeout(() => {
            const name = act.text;
            resolve(`بناءً على تحليلي لنشاط ${name}، ${getLocalKnowledge(act, intent)}`);
        }, 1200);
    });
}

// ==================== 🔊 محرك النطق المحسّن ====================
/**
 * ✅ محرك النطق مع دالة رد النداء
 */
function speak(text, callback = null) {
    window.speechSynthesis.cancel();
    AI_STATE.isSpeaking = true;
    
    const segments = detectAndSegmentLanguages(text);
    
    console.log('🗣️ نطق متعدد اللغات:', segments);
    
    if (segments.length === 0) {
        if (callback) callback();
        AI_STATE.isSpeaking = false;
        return;
    }
    
    let currentIndex = 0;
    
    function speakNextSegment() {
        if (currentIndex >= segments.length) {
            // ✅ جميع المقاطع انتهت
            AI_STATE.isSpeaking = false;
            console.log('✅ تم إنهاء النطق بالكامل');
            if (callback) {
                setTimeout(callback, 500); // ✅ تأخير بسيط قبل استدعاء الدالة
            }
            return;
        }
        
        const segment = segments[currentIndex];
        const utterance = new SpeechSynthesisUtterance(segment.text);
        
        if (segment.lang === 'en') {
            utterance.lang = 'en-US';
            utterance.rate = 0.95;
            utterance.pitch = 1.0;
            
            const voices = window.speechSynthesis.getVoices();
            const enVoice = voices.find(v => 
                v.lang.startsWith('en') && 
                (v.name.includes('Google') || v.name.includes('Microsoft'))
            );
            if (enVoice) utterance.voice = enVoice;
        } else {
            utterance.lang = 'ar-SA';
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            
            const voices = window.speechSynthesis.getVoices();
            const arVoice = voices.find(v => 
                v.lang.startsWith('ar') && 
                (v.name.includes('Google') || v.name.includes('Microsoft'))
            );
            if (arVoice) utterance.voice = arVoice;
        }
        
        utterance.onend = () => {
            currentIndex++;
            setTimeout(speakNextSegment, 100); // ✅ تأخير بين المقاطع
        };
        
        utterance.onerror = (event) => {
            console.error('❌ خطأ في النطق:', event);
            currentIndex++;
            setTimeout(speakNextSegment, 100);
        };
        
        window.speechSynthesis.speak(utterance);
    }
    
    speakNextSegment();
}

/**
 * ✅ إيقاف النطق الحالي
 */
function stopSpeaking() {
    window.speechSynthesis.cancel();
    AI_STATE.isSpeaking = false;
    console.log('🔇 تم إيقاف النطق');
}

/**
 * ✅ التحقق مما إذا كان المساعد يتحدث حالياً
 */
function isAssistantSpeaking() {
    return AI_STATE.isSpeaking;
}

function detectAndSegmentLanguages(text) {
    const segments = [];
    let currentSegment = { text: '', lang: null };
    
    const words = text.split(/(\s+)/);
    
    words.forEach(word => {
        const wordLang = detectWordLanguage(word.trim());
        
        if (!currentSegment.lang) {
            currentSegment.lang = wordLang;
            currentSegment.text = word;
        } else if (currentSegment.lang === wordLang || !word.trim()) {
            currentSegment.text += word;
        } else {
            if (currentSegment.text.trim()) {
                segments.push({ ...currentSegment });
            }
            currentSegment = { text: word, lang: wordLang };
        }
    });
    
    if (currentSegment.text.trim()) {
        segments.push(currentSegment);
    }
    
    return mergeSmallSegments(segments);
}

function detectWordLanguage(word) {
    if (!word) return 'ar';
    
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    const englishPattern = /[A-Za-z]/;
    
    if (arabicPattern.test(word)) {
        return 'ar';
    } else if (englishPattern.test(word)) {
        return 'en';
    }
    
    return 'ar';
}

function mergeSmallSegments(segments) {
    const merged = [];
    let i = 0;
    
    while (i < segments.length) {
        const segment = segments[i];
        
        if (segment.text.trim().split(/\s+/).length <= 2 && merged.length > 0) {
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

// ==================== 🎨 واجهات العرض المحسّنة ====================
function showSmartChoices(searchResult) {
    if (AI_STATE.isMobile) {
        showSmartChoicesMobile(searchResult);
    } else {
        showSmartChoicesDesktop(searchResult);
    }
}

function showSmartChoicesDesktop(searchResult) {
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
            
            <div class="desktop-card mb-3 p-3 bg-light border border-success border-2 rounded-3 cursor-pointer" 
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
                <button onclick="retryVoiceSearch()" class="desktop-btn btn btn-outline-primary">
                    <i class="fas fa-redo me-2"></i>أعد البحث بصوتك
                </button>
            </div>
        </div>
    `;
    
    content.innerHTML = html;
    
    const alternativesCount = alternatives.length;
    const speechText = alternativesCount > 0 ?
        `وجدت ${alternativesCount + 1} احتمالات. الأقرب هو ${bestMatch.text}. قل رقم الخيار، أو اضغط على الخيار المطلوب.` :
        `أقرب نتيجة هي ${bestMatch.text}. هل هذا ما تقصده؟`;
    
    speak(speechText);
}

function showSmartChoicesMobile(searchResult) {
    const { bestMatch, alternatives, confidence, reasoning } = searchResult;
    
    const overlay = document.getElementById('expert-panel-overlay');
    const content = document.getElementById('expert-panel-content');
    
    overlay.style.display = 'block';
    
    const html = `
        <div class="mobile-header bg-warning text-dark d-flex justify-content-between align-items-center px-3">
            <h5 class="mb-0 text-truncate-2">
                <i class="fas fa-question-circle me-2"></i>
                وجدت عدة احتمالات
            </h5>
            <button onclick="closePanel()" class="btn-close"></button>
        </div>
        
        <div class="mobile-scroll-container">
            <div class="mobile-content">
                <div class="alert alert-info border-0 mb-3">
                    <p class="mb-1"><strong>💡 التحليل:</strong> ${reasoning}</p>
                    <p class="mb-0 small">الثقة: <strong>${(confidence * 100).toFixed(0)}%</strong></p>
                </div>
                
                <h6 class="fw-bold mb-3 text-dark">اختر النشاط:</h6>
                
                <!-- أفضل اختيار -->
                <div class="card-mobile mb-3 p-3 border-success border-2 cursor-pointer" 
                     onclick="selectActivityFromChoice('${bestMatch.value}', '${bestMatch.text}')"
                     style="background: linear-gradient(135deg, #e8f5e9, #c8e6c9);">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="flex-grow-1 me-2">
                            <div class="d-flex align-items-center mb-2">
                                <span class="badge bg-success me-2">⭐</span>
                                <span class="small text-muted">الأقرب للمطلوب</span>
                            </div>
                            <h6 class="mb-1 text-truncate-2 text-dark">${bestMatch.text}</h6>
                            <small class="text-muted d-block text-truncate-2">${bestMatch.reasoning || ''}</small>
                        </div>
                        <div class="text-end" style="flex-shrink: 0;">
                            <div class="h4 mb-0 text-success">${Math.round(bestMatch.finalScore / 10)}%</div>
                            <small class="text-muted small">تطابق</small>
                        </div>
                    </div>
                </div>
                
                <!-- الخيارات الأخرى -->
                ${alternatives.length > 0 ? `
                    <h6 class="text-muted mb-2">خيارات أخرى:</h6>
                    <div class="alternatives-list">
                        ${alternatives.map((alt, i) => `
                            <div class="card-mobile mb-2 cursor-pointer" 
                                 onclick="selectActivityFromChoice('${alt.value}', '${alt.text}')">
                                <div class="p-3">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div class="d-flex align-items-center">
                                            <div class="icon-circle bg-secondary text-white me-3">
                                                ${i + 2}
                                            </div>
                                            <div class="flex-grow-1">
                                                <h6 class="mb-0 text-truncate-2 text-dark">${alt.text}</h6>
                                                <small class="text-muted">نتيجة بديلة</small>
                                            </div>
                                        </div>
                                        <div class="text-end ms-2" style="flex-shrink: 0;">
                                            <span class="text-muted fw-bold">${Math.round(alt.finalScore / 10)}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
        
        <div class="mobile-footer">
            <button onclick="retryVoiceSearch()" class="btn-mobile btn btn-primary w-100">
                <i class="fas fa-microphone me-2"></i>أعد البحث صوتياً
            </button>
        </div>
    `;
    
    content.innerHTML = html;
    
    const speechText = alternatives.length > 0 ?
        `وجدت ${alternatives.length + 1} احتمالات. الأقرب هو ${bestMatch.text}. اضغط على الخيار المطلوب.` :
        `أقرب نتيجة هي ${bestMatch.text}. اضغط عليها للتأكيد.`;
    
    speak(speechText);
}

// ==================== 📊 لوحة المعلومات المحسّنة ====================
function showExpertDashboard(activity, intent, aiSpeech, searchResult = null) {
    if (AI_STATE.isMobile) {
        showExpertDashboardMobile(activity, intent, aiSpeech, searchResult);
    } else {
        showExpertDashboardDesktop(activity, intent, aiSpeech, searchResult);
    }
}

function showExpertDashboardDesktop(activity, intent, aiSpeech, searchResult = null) {
    const overlay = document.getElementById('expert-panel-overlay');
    const content = document.getElementById('expert-panel-content');
    
    overlay.style.display = 'block';
    
    const isGeneral = intent === 'general';
    const details = activity.details;
    
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
                    <p class="mb-0 fw-bold text-dark" style="line-height:1.6;">${aiSpeech}</p>
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
                    renderInfoCardDesktop('التراخيص المطلوبة', details.req, 'fa-file-invoice', 'primary') : ''}
                
                ${(isGeneral || intent === 'authority') ? 
                    renderInfoCardDesktop('الجهات المختصة', details.auth, 'fa-landmark', 'success') : ''}
                
                ${(isGeneral || intent === 'legal') ? 
                    renderInfoCardDesktop('السند القانوني', details.leg, 'fa-gavel', 'dark') : ''}
                
                ${(isGeneral || intent === 'location') ? 
                    renderInfoCardDesktop('الموقع المناسب', details.loc, 'fa-map-pin', 'info') : ''}
                
                ${(isGeneral || intent === 'technical') ? 
                    renderInfoCardDesktop('ملاحظات فنية', activity.technicalNotes || 'لا توجد ملاحظات', 
                        'fa-clipboard-check', 'warning') : ''}
                
                ${(isGeneral || intent === 'decree') ? 
                    renderInfoCardDesktop('الحوافز والقرارات', 
                        activity.text.includes('صناعي') ? 
                            'مخاطب بالقرار 104 لسنة 2022' : 
                            'غير مدرج في القرار 104 حالياً',
                        'fa-percentage', 'danger') : ''}
                
                ${((isGeneral || intent === 'guide') && details.guid && details.link) ? `
                    <div class="col-12">
                        <div class="guide-card-desktop">
                            <div class="card-body p-4">
                                <div class="d-flex align-items-center justify-content-between mb-3">
                                    <div class="d-flex align-items-center gap-3">
                                        <div class="guide-icon">
                                            <i class="fas fa-book-open text-white"></i>
                                        </div>
                                        <div class="text-white">
                                            <div class="small opacity-75 mb-1">📋 المرجع الرسمي</div>
                                            <h5 class="mb-0 fw-bold">${details.guid}</h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex gap-2 mt-3">
                                    <a href="${details.link}" target="_blank" class="btn btn-light flex-grow-1">
                                        <i class="fas fa-external-link-alt me-2"></i>فتح الدليل
                                    </a>
                                    <button onclick="copyGuideLink('${details.link}')" class="btn btn-outline-light" title="نسخ الرابط">
                                        <i class="fas fa-copy"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
            
            <!-- ✅ الإجراءات المحسنة -->
            <div class="mt-4 d-flex gap-2 justify-content-center flex-wrap">
                <button onclick="askMoreDetails()" class="desktop-btn btn btn-outline-primary">
                    <i class="fas fa-question-circle me-2"></i>اسأل المزيد
                </button>
                <button onclick="clearContextAndSearch()" class="desktop-btn btn btn-outline-secondary">
                    <i class="fas fa-search me-2"></i>بحث جديد
                </button>
                <button onclick="closePanel()" class="desktop-btn btn btn-secondary">
                    <i class="fas fa-times me-2"></i>إغلاق
                </button>
            </div>
        </div>
    `;
    
    content.innerHTML = html;
}

function showExpertDashboardMobile(activity, intent, aiSpeech, searchResult = null) {
    const overlay = document.getElementById('expert-panel-overlay');
    const content = document.getElementById('expert-panel-content');
    
    overlay.style.display = 'block';
    
    const isGeneral = intent === 'general';
    const details = activity.details;
    
    const html = `
        <!-- شريط العنوان -->
        <div class="mobile-header bg-primary text-white d-flex justify-content-between align-items-center px-3">
            <div class="flex-grow-1 me-2">
                <h5 class="mb-0 text-truncate-2">
                    <i class="fas fa-shield-alt me-2"></i>
                    ${activity.text}
                    ${searchResult ? `
                        <span class="badge ${searchResult.confidence > 0.85 ? 'bg-success' : 'bg-warning'} ms-2">
                            ${(searchResult.confidence * 100).toFixed(0)}%
                        </span>
                    ` : ''}
                </h5>
            </div>
            <button onclick="closePanel()" class="btn-close btn-close-white" style="flex-shrink: 0;"></button>
        </div>
        
        <!-- محتوى قابل للتمرير -->
        <div class="mobile-scroll-container">
            <div class="mobile-content">
                <!-- رد الذكاء الاصطناعي -->
                <div class="card-mobile mb-3 border-primary">
                    <div class="p-3">
                        <div class="d-flex align-items-start gap-2">
                            <div class="icon-circle bg-primary text-white me-3">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="flex-grow-1">
                                <p class="mb-0 fw-bold text-dark" style="line-height:1.6;">${aiSpeech}</p>
                                ${searchResult?.reasoning ? `
                                    <div class="mt-2 pt-2 border-top">
                                        <small class="text-muted">
                                            <i class="fas fa-brain me-1"></i>
                                            ${searchResult.reasoning}
                                        </small>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- بطاقات المعلومات -->
                <div class="info-cards-container">
                    ${(isGeneral || intent === 'license') ? 
                        renderInfoCardMobile('التراخيص المطلوبة', details.req, 'fa-file-invoice', '#0d6efd') : ''}
                    
                    ${(isGeneral || intent === 'authority') ? 
                        renderInfoCardMobile('الجهات المختصة', details.auth, 'fa-landmark', '#198754') : ''}
                    
                    ${(isGeneral || intent === 'legal') ? 
                        renderInfoCardMobile('السند القانوني', details.leg, 'fa-gavel', '#212529') : ''}
                    
                    ${(isGeneral || intent === 'location') ? 
                        renderInfoCardMobile('الموقع المناسب', details.loc, 'fa-map-pin', '#0dcaf0') : ''}
                    
                    ${(isGeneral || intent === 'technical') ? 
                        renderInfoCardMobile('ملاحظات فنية', activity.technicalNotes || 'لا توجد ملاحظات', 
                            'fa-clipboard-check', '#ffc107', true) : ''}
                    
                    ${(isGeneral || intent === 'decree') ? 
                        renderInfoCardMobile('الحوافز والقرارات', 
                            activity.text.includes('صناعي') ? 
                                'مخاطب بالقرار 104 لسنة 2022' : 
                                'غير مدرج في القرار 104 حالياً',
                            'fa-percentage', '#dc3545') : ''}
                    
                    ${((isGeneral || intent === 'guide') && details.guid && details.link) ? `
                        <div class="card-mobile mb-3 text-white" 
                             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin-bottom: 20px !important;">
                            <div class="p-3">
                                <div class="d-flex align-items-center mb-3">
                                    <div class="icon-circle bg-white bg-opacity-25 me-3">
                                        <i class="fas fa-book-open"></i>
                                    </div>
                                    <div>
                                        <div class="small opacity-75 mb-1">📋 المرجع الرسمي</div>
                                        <h6 class="mb-0 fw-bold text-truncate-2">${details.guid}</h6>
                                    </div>
                                </div>
                                <div class="d-flex gap-2">
                                    <a href="${details.link}" target="_blank" 
                                       class="btn btn-light flex-grow-1 rounded-pill">
                                        <i class="fas fa-external-link-alt me-2"></i>فتح الدليل
                                    </a>
                                    <button onclick="copyGuideLink('${details.link}')" 
                                            class="btn btn-outline-light rounded-circle" 
                                            style="width: 40px; height: 40px;">
                                        <i class="fas fa-copy"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                <!-- ✅ مساحة إضافية في الأسفل لمنع تغطية المحتوى -->
                <div style="height: 40px;"></div>
            </div>
        </div>
        
        <!-- ✅ أزرار ثابتة في الأسفل مع تحسينات -->
        <div class="mobile-footer">
            <div class="d-flex gap-2">
                <button onclick="askMoreDetails()" class="btn-mobile btn btn-primary flex-fill">
                    <i class="fas fa-question-circle me-1"></i>سؤال آخر
                </button>
                <button onclick="clearContextAndSearch()" class="btn-mobile btn btn-outline-secondary flex-fill">
                    <i class="fas fa-search me-1"></i>جديد
                </button>
            </div>
        </div>
    `;
    
    content.innerHTML = html;
}

function renderInfoCardDesktop(title, body, icon, color) {
    return `
        <div class="col-md-6">
            <div class="desktop-card h-100 border-0 shadow-sm">
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

function renderInfoCardMobile(title, body, icon, color, scrollable = false) {
    return `
        <div class="card-mobile mb-3">
            <div class="p-3">
                <div class="d-flex align-items-center mb-3">
                    <div class="icon-circle text-white me-3" style="background-color: ${color};">
                        <i class="fas ${icon}"></i>
                    </div>
                    <h6 class="mb-0 fw-bold flex-grow-1 text-dark">${title}</h6>
                </div>
                <div class="small ${scrollable ? 'scrollable-content' : ''}" 
                     style="line-height: 1.6; white-space: pre-line; ${scrollable ? 'max-height: 150px; overflow-y: auto;' : ''}">
                    ${body}
                </div>
            </div>
        </div>
    `;
}

// ==================== 🎬 دوال المساعدة المحسّنة ====================
function selectActivityFromChoice(value, text) {
    console.log('✅ اختيار من الخيارات:', text);
    
    const activity = masterActivityDB.find(a => a.value === value);
    
    if (activity) {
        ContextEngine.updateContext(activity, text, 'general');
        
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
    
    // ✅ إيقاف أي نطق جاري أولاً
    stopSpeaking();
    
    // ✅ تأخير بسيط قبل فتح المايك
    setTimeout(() => {
        try {
            if (recognition) recognition.start();
        } catch (e) {
            console.error('خطأ في بدء التعرف الصوتي:', e);
        }
    }, 500);
}

/**
 * ✅ دالة سؤال جديد محسّنة
 */
function askMoreDetails() {
    closePanel();
    
    // ✅ إيقاف النطق الحالي إذا كان جارياً
    stopSpeaking();
    
    const messages = [
        'ما الذي تريد معرفته بالتحديد عن هذا النشاط؟ يمكنك السؤال عن التراخيص، الموقع، الجهات، الملاحظات الفنية، أو الدليل الإرشادي.',
        'تَفضل، أنا جاهز للإجابة على أي استفسار آخر.',
        'نعم، ما سؤالك؟',
        'أنا في الخدمة، اسأل ما تشاء.',
        'تفضل، ماذا تريد أن تعرف أيضاً؟',
        'أي معلومة أخرى تحتاجها؟'
    ];
    
    if (!window.askMoreDetailsCount) {
        window.askMoreDetailsCount = 0;
    }
    
    const messageIndex = Math.min(window.askMoreDetailsCount, messages.length - 1);
    
    // ✅ تحديث الوظيفة لتنتظر انتهاء النطق
    speak(messages[messageIndex], () => {
        // ✅ هذه الدالة تنفذ بعد انتهاء النطق
        console.log('✅ انتهى النطق، جاهز لفتح المايك');
        
        // ✅ عرض رسالة توجيهية بدلاً من فتح المايك تلقائياً
        showMicPrompt();
    });
    
    window.askMoreDetailsCount++;
}

/**
 * ✅ عرض رسالة توجيهية لفتح المايك يدوياً
 */
function showMicPrompt() {
    const overlay = document.getElementById('expert-panel-overlay');
    const content = document.getElementById('expert-panel-content');
    
    if (!overlay || !content) return;
    
    overlay.style.display = 'block';
    
    const html = `
        <div class="mobile-header bg-info text-white d-flex justify-content-between align-items-center px-3">
            <h5 class="mb-0 text-truncate-2">
                <i class="fas fa-microphone me-2"></i>
                جاهز للاستماع
            </h5>
            <button onclick="closePanel()" class="btn-close btn-close-white"></button>
        </div>
        
        <div class="mobile-scroll-container">
            <div class="mobile-content text-center py-5">
                <div class="mb-4">
                    <div style="font-size: 4rem;">🎤</div>
                </div>
                <h4 class="mb-3 text-dark">جاهز للاستماع إليك</h4>
                <p class="text-muted mb-4">
                    اضغط على زر الميكروفون لبدء الحديث<br>
                    أو اكتب سؤالك مباشرة في مربع البحث
                </p>
                
                <div class="d-flex justify-content-center gap-3 mt-4">
                    <button onclick="startMicManually()" class="btn btn-primary btn-lg">
                        <i class="fas fa-microphone me-2"></i>فتح المايك
                    </button>
                    <button onclick="closePanel()" class="btn btn-outline-secondary">
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    `;
    
    content.innerHTML = html;
}

/**
 * ✅ فتح المايك يدوياً من المستخدم
 */
function startMicManually() {
    closePanel();
    
    // ✅ تأخير بسيط قبل الفتح
    setTimeout(() => {
        try {
            if (recognition) recognition.start();
        } catch (e) {
            console.error('خطأ في بدء التعرف الصوتي:', e);
        }
    }, 300);
}

function clearContextAndSearch() {
    ContextEngine.clearContext();
    closePanel();
    
    // ✅ إيقاف النطق أولاً
    stopSpeaking();
    
    speak('تم مسح السياق. ابدأ بحثاً جديداً.');
}

function closePanel() {
    const overlay = document.getElementById('expert-panel-overlay');
    if (overlay) overlay.style.display = 'none';
}

function copyGuideLink(link) {
    navigator.clipboard.writeText(link).then(() => {
        speak('تم نسخ رابط الدليل بنجاح');
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

// ==================== 🎨 واجهة المستخدم الرئيسية ====================
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
                color: white; cursor: pointer; 
                border: 2px solid rgba(255,255,255,0.4);
                box-shadow: 0 5px 20px rgba(0,0,0,0.4); 
                transition: transform 0.2s;
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
            
            /* أنماط خاصة بالدليل للكمبيوتر */
            .guide-card-desktop {
                position: relative;
                overflow: hidden;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 15px;
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
            }
            
            .guide-card-desktop .card-body {
                padding: 1.5rem;
            }
            
            .guide-card-desktop .guide-icon {
                width: 50px;
                height: 50px;
                background: rgba(255,255,255,0.2);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .guide-card-desktop .guide-icon i {
                font-size: 24px;
                color: white;
            }
            
            /* تحسينات للأزرار */
            .guide-card-desktop .btn-light {
                border-radius: 10px;
                font-weight: 600;
                color: #333 !important;
            }
            
            .guide-card-desktop .btn-outline-light {
                border-radius: 10px;
            }
            
            /* تحسينات للشاشات الصغيرة */
            @media (max-width: 767px) {
                #mic-btn { 
                    width: 55px !important; 
                    height: 55px !important; 
                    bottom: 20px !important; 
                    left: 20px !important; 
                }
                #speaker-btn { 
                    width: 45px !important; 
                    height: 45px !important; 
                    bottom: 85px !important; 
                    left: 27px !important; 
                }
                
                /* تحسينات للوحة في الموبايل */
                #expert-panel-content {
                    -webkit-overflow-scrolling: touch;
                    scroll-behavior: smooth;
                }
            }
            
            /* تحسينات للشاشات الصغيرة جداً */
            @media (max-width: 360px) {
                #mic-btn { 
                    width: 50px !important; 
                    height: 50px !important; 
                    bottom: 15px !important; 
                    left: 15px !important; 
                }
                #speaker-btn { 
                    width: 40px !important; 
                    height: 40px !important; 
                    bottom: 75px !important; 
                    left: 22px !important; 
                }
            }
            
            /* تحسينات للوضع الأفقي */
            @media (max-height: 500px) and (orientation: landscape) {
                #mic-btn { 
                    bottom: 10px !important; 
                    left: 10px !important; 
                }
                #speaker-btn { 
                    bottom: 70px !important; 
                    left: 17px !important; 
                }
                
                .mobile-content {
                    padding-bottom: 100px !important;
                }
            }
            
            /* تحسين الأنيميشن */
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .mobile-content > * {
                animation: fadeIn 0.3s ease-out;
            }
            
            /* تحسين التمرير */
            .mobile-scroll-container::-webkit-scrollbar {
                width: 6px;
            }
            
            .mobile-scroll-container::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 3px;
            }
            
            .mobile-scroll-container::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 3px;
            }
            
            .mobile-scroll-container::-webkit-scrollbar-thumb:hover {
                background: #555;
            }
        </style>
    `;
    
    const html = `
        <!-- أزرار العائمة -->
        <div id="mic-btn" class="ai-floating-btn">
            <i class="fas fa-microphone" style="font-size:24px;"></i>
        </div>
        <div id="speaker-btn" class="ai-floating-btn">
            <i class="fas fa-volume-up"></i>
        </div>
        
        <!-- مؤشر التحميل -->
        <div id="ai-loader" style="display:none; position:fixed; bottom:30px; left:50%; transform:translateX(-50%); background:white; padding:12px 25px; border-radius:50px; z-index:1000001; border:2px solid #0d6efd; box-shadow:0 5px 20px rgba(0,0,0,0.2);">
            <div class="d-flex align-items-center gap-2">
                <div class="spinner-border text-primary spinner-border-sm"></div>
                <span class="fw-bold">🧠 يتم التحليل الذكي...</span>
            </div>
        </div>
        
        <!-- النافذة المنبثقة الرئيسية -->
        <div id="expert-panel-overlay" style="display:none;">
            <div id="expert-panel-content"></div>
        </div>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
    document.body.insertAdjacentHTML('beforeend', html);
    
    setupEventListeners();
};

function setupEventListeners() {
    const micBtn = document.getElementById('mic-btn');
    const speakerBtn = document.getElementById('speaker-btn');
    
    if (micBtn) {
        micBtn.onclick = () => {
            // ✅ إيقاف أي نطق جاري أولاً
            stopSpeaking();
            
            // ✅ تأخير بسيط قبل فتح المايك
            setTimeout(() => {
                try {
                    if (recognition) recognition.start();
                } catch (e) {
                    console.warn('⚠️ محاولة بدء التعرف أثناء التشغيل');
                }
            }, 300);
        };
    }
    
    if (speakerBtn) {
        speakerBtn.onclick = () => {
            stopSpeaking();
        };
    }
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
    console.log('🚀 VoiceAgent Pro v4.1 - التهيئة...');
    
    // 🔊 تحميل الأصوات المتاحة
    if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
            const voices = window.speechSynthesis.getVoices();
            console.log('🗣️ الأصوات المتاحة:', voices.length);
        };
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
    
    // كشف الجهاز وتطبيق الأنماط
    detectDeviceAndApplyStyles();
    
    // إنشاء الواجهة
    createFloatingUI();
    
    // تهيئة محرك النطق
    initSpeechEngine();
    
    // تحديث حالة الجهاز عند تغيير حجم الشاشة
    window.addEventListener('resize', detectDeviceAndApplyStyles);
    window.addEventListener('orientationchange', function() {
        setTimeout(detectDeviceAndApplyStyles, 100);
    });
    
    console.log('✅ VoiceAgent Pro v4.1 جاهز للعمل! 🎉');
    
    // ✅ رسالة ترحيبية مع تحسينات
    setTimeout(() => {
        speak('مَرحباً! أنا مساعدك المتخصص في اللجان. اضغط على زر الميكروفون وابدأ الحديث، أو اكتب سؤالك في مربع البحث.', () => {
            console.log('✅ تم إنهاء الرسالة الترحيبية');
        });
    }, 1000);
});

// ==================== 🎯 تصدير الدوال للاستخدام الخارجي ====================
window.VoiceAgentPro = {
    handleIntelligence,
    speak,
    stopSpeaking,
    isAssistantSpeaking,
    closePanel,
    retryVoiceSearch,
    askMoreDetails,
    startMicManually,
    clearContextAndSearch,
    searchExample,
    selectActivityFromChoice,
    copyGuideLink,
    detectDeviceAndApplyStyles,
    get isMobile() {
        return AI_STATE.isMobile;
    }
};

console.log('🎉 VoiceAgent Pro v4.1 - تم التحميل بنجاح مع جميع التحسينات!');
