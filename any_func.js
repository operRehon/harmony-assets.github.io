
// =============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// =============================================

function roundUpTo10(num) { return Math.ceil(num); }

function generateId() { return Date.now().toString(36) + Math.random().toString(36).substr(2); }

function getProductTypeName(type) { 
    const typeNames = { sheet: "Листовая печать", visiting: "Визитки", booklet: "Лифлеты", book: "Книги" };
    return typeNames[type] || "Изделие";
}

function getColorTypeName(colorTypeId) {
    const colorTypeNames = { 
        1: '4+0 (односторонняя цветная)',
        2: '4+4 (двусторонняя цветная)', 
        3: '1+0 (односторонняя черно-белая)',
        4: '1+1 (двусторонняя черно-белая)', 
        5: '4+1 (смешанная печать)',
        6: '4+0 (односторонняя цветная)',
        7: '1+0 (односторонняя черно-белая)',
        8: '4+1 (смешанная печать)'
    };
    return colorTypeNames[colorTypeId] || 'Неизвестный тип';
}

function getFormatName(formatId) {
    const formatNames = {
        1: 'А3',
        2: 'А4',
        3: 'А5',
        4: 'А6',
        5: 'А7',
        6: 'А8'
    };
    return formatNames[formatId] || 'Неизвестный формат';
}

function getPaperName(paperId) {
    const paperNames = { 
        1: 'ВХИ',
        2: 'Мелованная 90-115 г/м²',
        3: 'Мелованная 130-170 г/м²', 
        4: 'Мелованная 200-250 г/м²',
        5: 'Мелованная 300 г/м²',
        6: 'Картон 250-270 г/м²',
        7: 'Лён',
        8: 'Жемчуг',
        9: 'Самоклейка',
        10: '300 г/м²',
        13: 'Дизайнерская',
        14: 'Лён',
        15: 'Жемчуг' 
    };
    return paperNames[paperId] || 'Неизвестная бумага';
}

function getLaminationTypeName(laminationTypeId) {
    const laminationTypeNames = {
        1: 'Глянцевая',
        2: 'Матовая',
        3: 'Самоклеяющаяся',
        4: 'Софт тач'
    };
    return laminationTypeNames[laminationTypeId] || 'Неизвестный тип';
}

function getPricePerHit(hits) {
    if (hits >= 200)
        return 0.0844;
    if (hits >= 100)
        return 0.1085;
    if (hits >= 50)
        return 0.1446;
    return 0.1808;
}

function getBindingPrice(sheets, format, withCover) {
    if (format !== 1 && format !== 2)
        return 0;
    let priceTable = format === 1 ? BINDING_PRICES_A3 : BINDING_PRICES_A4;
    let price = 0;
    
    if (sheets >= 105)
        price = priceTable[105];
    else if (sheets >= 85)
        price = priceTable[85];
    else if (sheets >= 70)
        price = priceTable[70];
    else if (sheets >= 60)
        price = priceTable[60];
    else if (sheets >= 50)
        price = priceTable[50];
    else if (sheets >= 40)
        price = priceTable[40];
    else if (sheets >= 20)
        price = priceTable[20];
    
    if (withCover)
        price += (format === 1 ? 0.3614457831 : 0.2409638554);
    return price;
}

function detectFormatBySize(width, height) {
    if (!width || !height) return null;
    const tolerance = 2;
    const orientations = [{width: width, height: height}, {width: height, height: width}];

    for (const orientation of orientations) {
        for (const [formatId, size] of Object.entries(FORMAT_SIZES)) {
            if (Math.abs(orientation.width - size.width) <= tolerance && 
                Math.abs(orientation.height - size.height) <= tolerance) {
                return parseInt(formatId);
            }
        }
    }
    return null;
}
