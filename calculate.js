
// =============================================
// ФУНКЦИИ РАСЧЕТА СТОИМОСТИ
// =============================================

function calculateProductCost(product) {
    switch (product.type) {
        case 'visiting': return calculateVisitingCardCost(product);
        case 'booklet': return calculateRefletCost(product);
        case 'book': return calculateBookCost(product);
        default: return calculateSheetCost(product);
    }
}

function calculateItemsPerSheet(width, height) {
    if (!width || !height || width <= 0 || height <= 0)
        return 1;
    const itemWidth = width + CUT_MARGIN;
    const itemHeight = height + CUT_MARGIN;
    if (itemWidth > SHEET_WIDTH || itemHeight > SHEET_HEIGHT)
        return 1;
    const horizontalCount = Math.floor(SHEET_WIDTH / itemWidth);
    const horizontalRows = Math.floor(SHEET_HEIGHT / itemHeight);
    const horizontalTotal = horizontalCount * horizontalRows;
    const verticalCount = Math.floor(SHEET_WIDTH / itemHeight);
    const verticalRows = Math.floor(SHEET_HEIGHT / itemWidth);
    const verticalTotal = verticalCount * verticalRows;
    return Math.max(horizontalTotal, verticalTotal, 1);
}

function calculateSheetCost(product) {
    const kras = product.kras || 1;
    const item = product.item || 1;
    const razmer = product.razmer || 2;
    const pap = product.pap || 2;
    const width = product.width || (FORMAT_SIZES[razmer] ? FORMAT_SIZES[razmer].width : 148);
    const height = product.height || (FORMAT_SIZES[razmer] ? FORMAT_SIZES[razmer].height : 210);
    let itemsPerSheet = calculateItemsPerSheet(width, height);
    const sheetsRequired = Math.ceil(item / itemsPerSheet);
    const itemsPerA = item / itemsPerSheet;
    let quantityCategory;
    const baseQuantity = 5 * itemsPerSheet;
    if (item <= baseQuantity)
        quantityCategory = 0;
    else if (item <= 10 * itemsPerSheet)
        quantityCategory = 1;
    else if (item <= 50 * itemsPerSheet)
        quantityCategory = 2;
    else if (item <= 100 * itemsPerSheet)
        quantityCategory = 3;
    else if (item <= 500 * itemsPerSheet)
        quantityCategory = 4;
    else
        quantityCategory = 5;
    let costPrintOnly = 0;
    if (kras === 1)
        costPrintOnly = KRAS1_PRICES[quantityCategory] * itemsPerA * DOLLARS;
    else if (kras === 2)
        costPrintOnly = KRAS2_PRICES[quantityCategory] * itemsPerA * DOLLARS;
    else if (kras === 3)
        costPrintOnly = KRAS3_PRICE * itemsPerA * DOLLARS;
    else if (kras === 4)
        costPrintOnly = KRAS4_PRICE * itemsPerA * DOLLARS;
    else if (kras === 5)
        costPrintOnly = (KRAS1_PRICES[quantityCategory] + KRAS3_PRICE) * itemsPerA * DOLLARS;
    let costPaperOnly = 0;
    if (pap >= 1 && pap <= 12)
        { if (!((kras === 3 || kras === 4) && pap === 1)) costPaperOnly = PAPER_PRICES[pap-1] * itemsPerA * DOLLARS; }
    const cuttingCost = ((itemsPerSheet/2) + 4) * CUTTING_PRICE_PER_HIT;
    let result = costPrintOnly + costPaperOnly + cuttingCost;
    let additionalCosts = calculateAdditionalCosts(product, sheetsRequired, item, razmer);
    result += additionalCosts.total;
    result = roundUpTo10(result);
    return {
        totalCost: result,
        costPrintOnly: costPrintOnly,
        costPaperOnly: costPaperOnly,
        itemRez: cuttingCost,
        ...additionalCosts,
        itemsPerSheet: itemsPerSheet,
        sheetsUsed: sheetsRequired
    };
}

function calculateAdditionalCosts(product, totalSheets, item, razmer) {
    let costs = {
        embossingCost: 0, dieCuttingCost: 0, laminationCost: 0, scoringCost: 0,
        foldingCost: 0, cornerRoundingCost: 0, numberingCost: 0, perforationCost: 0,
        gluingCost: 0, bindingCost: 0, bookletScoringCost: 0, total: 0
    };
    if (product.type === 'booklet') {
        costs.bookletScoringCost = 2 * SCORING_PRICE_PER_HIT * item * DOLLARS;
        if (product.bookletEmbossingRequired && product.bookletEmbossingHits >= 20) {
            const pricePerHit = getPricePerHit(product.bookletEmbossingHits);
            costs.embossingCost = (EMBOSSING_SETUP * DOLLARS) + (product.bookletEmbossingHits * pricePerHit * DOLLARS);
        }
        if (product.bookletLaminationRequired)
            costs.laminationCost = LAMINATION_PRICES[product.bookletLaminationType] * totalSheets * DOLLARS;
    }
    if (product.type === 'visiting') {
        if (product.visitingCornerRoundingRequired && product.visitingCornerRoundingSheets > 0) costs.cornerRoundingCost = product.visitingCornerRoundingSheets * CORNER_ROUNDING_PRICE * DOLLARS;
    }
    if (product.type === 'sheet') {
        if (product.embossingRequired && product.embossingHits >= 20) {
            const pricePerHit = getPricePerHit(product.embossingHits);
            costs.embossingCost = (EMBOSSING_SETUP * DOLLARS) + (product.embossingHits * pricePerHit * DOLLARS);
        }
        if (product.dieCuttingRequired && product.dieCuttingHits >= 20) {
            const pricePerHit = getPricePerHit(product.dieCuttingHits);
            costs.dieCuttingCost = (DIE_CUTTING_SETUP * DOLLARS) + (product.dieCuttingHits * pricePerHit * DOLLARS);
        }
        if (product.laminationRequired)
            costs.laminationCost = LAMINATION_PRICES[product.laminationType] * totalSheets * DOLLARS;
        if (product.scoringRequired)
            costs.scoringCost = product.scoringHits * SCORING_PRICE_PER_HIT * item * DOLLARS;
        if (product.foldingRequired)
            costs.foldingCost = product.foldingHits * FOLDING_PRICE_PER_HIT * item * DOLLARS;
        if (product.cornerRoundingRequired)
            costs.cornerRoundingCost = product.cornerRoundingSheets * CORNER_ROUNDING_PRICE * DOLLARS;
        if (product.numberingRequired)
            costs.numberingCost = product.numberingSheets * NUMBERING_PRICE * DOLLARS;
        if (product.perforationRequired)
            costs.perforationCost = product.perforationSheets * PERFORATION_PRICE * DOLLARS;
        if (product.gluingRequired && (razmer === 2 || razmer === 3))
            costs.gluingCost = GLUING_PRICES[razmer] * product.gluingSheets * DOLLARS;
        if (product.bindingRequired) {
            if (product.bindingType === 'spiral' && (razmer === 1 || razmer === 2))
                costs.bindingCost = getBindingPrice(product.bindingSheets, razmer, product.bindingWithCover) * product.bindingCount * DOLLARS;
            else if (product.bindingType === 'staple')
                costs.bindingCost = (product.stapleBindingCount || product.bindingCount) * 25;
        }
    }
    costs.total = Object.values(costs).reduce((sum, cost) => sum + (typeof cost === 'number' ? cost : 0), 0);
    return costs;
}

function calculateVisitingCardCost(product) {
    let kras = product.kras || 1;
    let item = product.item || 96;
    const pap = product.pap || 10;
    if (item % 24 !== 0)
        item = Math.ceil(item / 24) * 24;
    let categoryIndex = 3;
    if (item >= 96 && item <= 311)
        categoryIndex = 0;
    else if (item >= 312 && item <= 499)
        categoryIndex = 1;
    else if (item >= 500 && item <= 959)
        categoryIndex = 2;
    const priceKey = `${kras}_${pap}`;
    let pricePerItem = VISITING_CARD_PRICES[priceKey]?.[categoryIndex] || 0;
    if (product.visitingLaminationRequired && product.visitingLaminationType && pap === 10) {
        if (product.visitingLaminationType == 1) pricePerItem = VISITING_CARD_PRICES_MATTE_LAMINATION[priceKey]?.[categoryIndex] || pricePerItem;
        else if (product.visitingLaminationType == 2) pricePerItem = VISITING_CARD_PRICES_SOFT_TOUCH_LAMINATION[priceKey]?.[categoryIndex] || pricePerItem;
    }
    let totalCost = pricePerItem * item;
    const totalSheets = Math.ceil(item / 24);
    let visitingCornerRoundingCost = 0;
    if (product.visitingCornerRoundingRequired && product.visitingCornerRoundingSheets > 0) {
        visitingCornerRoundingCost = product.visitingCornerRoundingSheets * CORNER_ROUNDING_PRICE * DOLLARS;
        totalCost += visitingCornerRoundingCost;
    }
    totalCost = roundUpTo10(totalCost);
    return {
        totalCost: totalCost,
        costPrintOnly: pricePerItem * item,
        costPaperOnly: 0,
        itemRez: 0,
        laminationCost: 0,
        cornerRoundingCost: visitingCornerRoundingCost,
        itemsPerSheet: 24,
        sheetsUsed: totalSheets
    };
}

function calculateRefletCost(product) {
    const kras = product.kras || 2;
    const item = product.item || 100;
    const pap = product.pap || 2;
    const bookletSize = product.bookletSize || 'A4';
    let width, height, itemsPerSheet;
    if (bookletSize === 'A3') {
        width = 297; height = 420;
        itemsPerSheet = 1;
        product.razmer = 1;
    } 
    else {
        width = 210;
        height = 297;
        itemsPerSheet = 2;
        product.razmer = 2;
    }
    const sheetsRequired = Math.ceil(item / itemsPerSheet);
    const itemsPerA = item / itemsPerSheet;
    let quantityCategory;
    const baseQuantity = 5 * itemsPerSheet;
    if (item <= baseQuantity)
        quantityCategory = 0;
    else if (item <= 10 * itemsPerSheet)
        quantityCategory = 1;
    else if (item <= 50 * itemsPerSheet)
        quantityCategory = 2;
    else if (item <= 100 * itemsPerSheet)
        quantityCategory = 3;
    else if (item <= 500 * itemsPerSheet)
        quantityCategory = 4;
    else
        quantityCategory = 5;
    let costPrintOnly = 0;
    if (kras === 1)
        costPrintOnly = KRAS1_PRICES[quantityCategory] * itemsPerA * DOLLARS;
    else if (kras === 2)
        costPrintOnly = KRAS2_PRICES[quantityCategory] * itemsPerA * DOLLARS;
    else if (kras === 3)
        costPrintOnly = KRAS3_PRICE * itemsPerA * DOLLARS;
    else if (kras === 4)
        costPrintOnly = KRAS4_PRICE * itemsPerA * DOLLARS;
    else if (kras === 5)
        costPrintOnly = (KRAS1_PRICES[quantityCategory] + KRAS3_PRICE) * itemsPerA * DOLLARS;
    let costPaperOnly = 0;
    if (pap >= 1 && pap <= 12) {
        if (!((kras === 3 || kras === 4) && pap === 1)) costPaperOnly = PAPER_PRICES[pap-1] * itemsPerA * DOLLARS;
    }
    const cuttingCost = ((itemsPerSheet/2) + 4) * CUTTING_PRICE_PER_HIT;
    let result = costPrintOnly + costPaperOnly + cuttingCost;
    let additionalCosts = calculateAdditionalCosts(product, sheetsRequired, item, product.razmer);
    result += additionalCosts.total;
    result = roundUpTo10(result);
    return {
        totalCost: result,
        costPrintOnly: costPrintOnly,
        costPaperOnly: costPaperOnly,
        itemRez: cuttingCost,
        ...additionalCosts,
        itemsPerSheet: itemsPerSheet,
        sheetsUsed: sheetsRequired
    };
}

function calculateBookCost(product) {
    const quantity = product.bookQuantity || 10;
    const bodyColorType = product.bookBodyColorType || 4;
    const bodyFormat = product.bookBodyFormat || 2;
    const bodySheets = product.bookBodySheets || 1;
    const bodyPaperType = product.bookBodyPaperType || 1;
    const coverNotRequired = product.bookCoverNotRequired || false;
    const coverColorType = product.bookCoverColorType || 4;
    const coverPaperType = product.bookCoverPaperType || 1;
    const coverLaminationType = product.bookCoverLaminationType || 0; // 0 = нет ламинации
    const bindingType = product.bookBindingType || 'soft';
    // Расчет стоимости тела книги
    let bodyCost = 0;
    const totalBodySheets = quantity * bodySheets;
    if (bodyColorType == 4) { // 1+1 (черно-белая)
        let a3Sheets;
        if (bodyFormat == 2)
            a3Sheets = totalBodySheets / 2;
        else if (bodyFormat == 3)
            a3Sheets = totalBodySheets / 4;
        else if (bodyFormat == 4)
            a3Sheets = totalBodySheets / 8;
        else
            a3Sheets = totalBodySheets;
        bodyCost = BOOK_PRICES['4'] * a3Sheets;
        if (bodyPaperType != 1)
            bodyCost += (PAPER_PRICES[bodyPaperType-1] || 0) * a3Sheets * DOLLARS;
    } else if (bodyColorType == 2) { // 4+4 (цветная)
        let priceTier;
        if (totalBodySheets <= 50)
            priceTier = '51-100';
        else if (totalBodySheets <= 100)
            priceTier = '101-500';
        else
            priceTier = '500+';
        const pricePerA3Sheet = BOOK_PRICES['2'][priceTier];
        let a3Sheets;
        if (bodyFormat == 2)
            a3Sheets = totalBodySheets / 2;
        else if (bodyFormat == 3)
            a3Sheets = totalBodySheets / 4;
        else if (bodyFormat == 4)
            a3Sheets = totalBodySheets / 8;
        else
            a3Sheets = totalBodySheets;
        bodyCost = pricePerA3Sheet * a3Sheets;
        if (bodyPaperType != 1)
            bodyCost += (PAPER_PRICES[bodyPaperType-1] || 0) * a3Sheets * DOLLARS;
    } else if (bodyColorType == 8) { // 4+1 (смешанная печать) - как 4+0 + 1+0
        // Расчет для цветной стороны (4+0)
        let priceTier;
        if (totalBodySheets <= 50)
            priceTier = '51-100';
        else if (totalBodySheets <= 100)
            priceTier = '101-500';
        else
            priceTier = '500+';
        const colorPricePerA3Sheet = BOOK_PRICES['2'][priceTier] / 2;
        // Расчет для черно-белой стороны (1+0)
        const bwPricePerA3Sheet = BOOK_PRICES['4'] / 2;
        let a3Sheets;
        if (bodyFormat == 2)
            a3Sheets = totalBodySheets / 2;
        else if (bodyFormat == 3)
            a3Sheets = totalBodySheets / 4;
        else if (bodyFormat == 4)
            a3Sheets = totalBodySheets / 8;
        else
            a3Sheets = totalBodySheets;
        bodyCost = (colorPricePerA3Sheet + bwPricePerA3Sheet) * a3Sheets;
        if (bodyPaperType != 1)
            bodyCost += (PAPER_PRICES[bodyPaperType-1] || 0) * a3Sheets * DOLLARS;
    }
    // Расчет стоимости обложки - ТОЛЬКО ЕСЛИ ОБЛОЖКА ТРЕБУЕТСЯ
    let coverCost = 0;
    if (!coverNotRequired) {
        // Расчет печати обложки с учетом формата
        let a3SheetsForCover = quantity;
        if (coverColorType == 4)
            coverCost = BOOK_PRICES['4'] * a3SheetsForCover;
        else if (coverColorType == 2) { // 4+4
            let priceTier;
            if (quantity <= 50)
                priceTier = '51-100';
            else if (quantity <= 100)
                priceTier = '101-500';
            else
                priceTier = '500+';
            const pricePerA3Sheet = BOOK_PRICES['2'][priceTier];
            coverCost = pricePerA3Sheet * a3SheetsForCover;
        } else if (coverColorType == 6) { // 4+0
            let priceTier;
            if (quantity <= 50)
                priceTier = '51-100';
            else if (quantity <= 100)
                priceTier = '101-500';
            else
                priceTier = '500+';
            const pricePerA3Sheet = BOOK_PRICES['2'][priceTier] / 2;
            coverCost = pricePerA3Sheet * a3SheetsForCover;
        } else if (coverColorType == 8) { // 4+1
            let priceTier;
            if (quantity <= 50)
                priceTier = '51-100';
            else if (quantity <= 100)
                priceTier = '101-500';
            else
                priceTier = '500+';
            const colorPricePerA3Sheet = BOOK_PRICES['2'][priceTier] / 2;
            const bwPricePerA3Sheet = BOOK_PRICES['4'] / 2;
            coverCost = (colorPricePerA3Sheet + bwPricePerA3Sheet) * a3SheetsForCover;
        }
        // Бумага для обложки
        if (coverPaperType != 1)
            coverCost += (PAPER_PRICES[coverPaperType-1] || 0) * a3SheetsForCover * DOLLARS;
        if (coverLaminationType != 0)
            coverCost += BOOK_LAMINATION_PRICES[coverLaminationType] * quantity;
    }
    // Расчет стоимости переплета - ВСЕГДА, даже если обложка не требуется
    let bindingCost = 0;
    if (bindingType === 'hard') {
        const formatKey = bodyFormat == 2 ? 'A4' : (bodyFormat == 3 ? 'A5' : 'A6');
        const priceInfo = BOOK_BINDING_PRICES.hard[formatKey];
        if (quantity <= 30)
            bindingCost = priceInfo.min * quantity;
        else if (quantity <= 99)
            bindingCost = priceInfo.mid * quantity;
        else
            bindingCost = priceInfo.max * quantity;
    }
    else if (bindingType === 'soft')
        bindingCost = BOOK_BINDING_PRICES.soft.setup + (BOOK_BINDING_PRICES.soft.per_book * quantity);
    else if (bindingType === 'staple')
        bindingCost = BOOK_BINDING_PRICES.staple * quantity;
    const totalCost = bodyCost + coverCost + bindingCost;
    return {
        totalCost: roundUpTo10(totalCost),
        bodyCost: bodyCost,
        coverCost: coverCost,
        bindingCost: bindingCost,
        itemsPerSheet: 1,
        sheetsUsed: quantity
    };
}
