// =============================================
// ФУНКЦИИ ОТОБРАЖЕНИЯ И УВЕДОМЛЕНИЙ
// =============================================

function renderSheetLayout(itemsPerSheet, productType, width = null, height = null) {
    const sheet = document.getElementById('a3Sheet');
    if (!sheet)
        return;
    sheet.innerHTML = '';
    sheet.style.width = '60%';
    sheet.style.height = 'auto';
    sheet.style.aspectRatio = '297/420';
    if ((!width || !height) && productType !== 'visiting' && productType !== 'booklet') {
        width = parseInt(document.getElementById('width').value) || 297;
        height = parseInt(document.getElementById('height').value) || 210;
    }
    if (productType === 'visiting') {
        const layout = document.createElement('div');
        layout.className = 'visiting-card-layout';
        for (let i = 0; i < 24; i++) {
            const card = document.createElement('div');
            card.className = 'visiting-card-item';
            card.title = `Визитка ${i+1}`;
            const cardText = document.createElement('div');
            cardText.className = 'visiting-card-size';
            cardText.textContent = '50×90 мм';
            card.appendChild(cardText);
            layout.appendChild(card);
        }
        sheet.appendChild(layout);
    } else if (productType === 'booklet') {
        const bookletSize = document.querySelector('input[name="bookletSize"]:checked').value;
        if (bookletSize === 'A3') {
            const layout = document.createElement('div');
            layout.style.cssText = `width: 100%; height: 100%; display: flex; position: relative;`;
            const booklet = document.createElement('div');
            booklet.className = 'item-on-sheet';
            booklet.style.cssText = `width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; box-sizing: border-box; border: 2px solid var(--dark); background: rgba(110, 189, 82, 0.2); position: relative;`;
            const bookletText = document.createElement('div');
            bookletText.className = 'item-outline';
            bookletText.style.cssText = `color: var(--dark); font-weight: 700; text-align: center; font-size: 14px; transform: rotate(0deg); text-shadow: 0 0 2px rgba(255,255,255,0.8);`;
            bookletText.textContent = 'Лифлет А3';
            booklet.appendChild(bookletText);
            const foldLine1 = document.createElement('div'); foldLine1.className = 'fold-line-horizontal'; foldLine1.style.top = '33%';
            const foldLine2 = document.createElement('div'); foldLine2.className = 'fold-line-horizontal'; foldLine2.style.top = '66%';
            booklet.appendChild(foldLine1); booklet.appendChild(foldLine2);
            layout.appendChild(booklet); sheet.appendChild(layout);
        } else {
            const layout = document.createElement('div');
            layout.style.cssText = `width: 100%; height: 100%; display: flex; flex-direction: column; position: relative;`;
            for (let i = 0; i < Math.min(itemsPerSheet, 2); i++) {
                const booklet = document.createElement('div');
                booklet.className = 'item-on-sheet';
                booklet.style.cssText = `width: 100%; height: 50%; display: flex; align-items: center; justify-content: center; box-sizing: border-box; border: 2px solid var(--dark); background: rgba(110, 189, 82, 0.2); position: relative;`;
                const bookletText = document.createElement('div');
                bookletText.className = 'item-outline';
                bookletText.style.cssText = `color: var(--dark); font-weight: 700; text-align: center; font-size: 14px; transform: rotate(0deg); text-shadow: 0 0 2px rgba(255,255,255,0.8);`;
                bookletText.textContent = 'Лифлет А4';
                booklet.appendChild(bookletText);
                const foldLine1 = document.createElement('div'); foldLine1.className = 'fold-line-vertical'; foldLine1.style.left = '33%';
                const foldLine2 = document.createElement('div'); foldLine2.className = 'fold-line-vertical'; foldLine2.style.left = '66%';
                booklet.appendChild(foldLine1); booklet.appendChild(foldLine2);
                layout.appendChild(booklet);
            }
            sheet.appendChild(layout);
        }
    } else {
        let cols, rows;
        if (itemsPerSheet <= 1) {
            cols = 1;
            rows = 1;
        } 
        else {
            const itemWidth = width + CUT_MARGIN; const itemHeight = height + CUT_MARGIN;
            const horizontalCols = Math.floor(SHEET_WIDTH / itemWidth); const horizontalRows = Math.floor(SHEET_HEIGHT / itemHeight); const horizontalTotal = horizontalCols * horizontalRows;
            const verticalCols = Math.floor(SHEET_WIDTH / itemHeight); const verticalRows = Math.floor(SHEET_HEIGHT / itemWidth); const verticalTotal = verticalCols * verticalRows;
            if (horizontalTotal >= verticalTotal) {
                cols = horizontalCols;
                rows = horizontalRows;
            } 
            else {
                cols = verticalCols;
                rows = verticalRows;
            }
            const maxItems = cols * rows;
            if (maxItems < itemsPerSheet)
                itemsPerSheet = maxItems;
        }
        const itemsToShow = Math.min(itemsPerSheet, 32);
        if (itemsToShow <= 0)
            return;
        const itemWidthPercent = 100 / cols; const itemHeightPercent = 100 / rows;
        let formatName = 'Кастомный';
        const formatSelect = document.getElementById('formatType');
        if (formatSelect && formatSelect.selectedIndex >= 0 && formatSelect.value)
            formatName = formatSelect.options[formatSelect.selectedIndex].text.split(' ')[0];
        else
            formatName = `${width}×${height} мм`;
        for (let i = 0; i < itemsToShow; i++) {
            const row = Math.floor(i / cols); const col = i % cols;
            const item = document.createElement('div');
            item.className = 'item-on-sheet';
            item.style.cssText = `position: absolute; width: ${itemWidthPercent}%; height: ${itemHeightPercent}%; top: ${row * itemHeightPercent}%; left: ${col * itemWidthPercent}%; display: flex; align-items: center; justify-content: center; box-sizing: border-box; border: 2px solid color(black); background: rgba(110, 189, 82, 0.2); border-radius: 4px;`;
            const formatText = document.createElement('div');
            formatText.className = 'item-outline';
            formatText.style.cssText = `color: var(--dark); font-weight: 700; text-align: center; text-shadow: 0 0 2px rgba(255,255,255,0.8); line-height: 1.1; padding: 2px;`;
            if (itemsToShow <= 4)
                formatText.style.fontSize = '14px';
            else if (itemsToShow <= 8)
                formatText.style.fontSize = '12px';
            else if (itemsToShow <= 16)
                formatText.style.fontSize = '10px';
            else
                formatText.style.fontSize = '8px';
            formatText.textContent = formatName;
            item.appendChild(formatText);
            item.title = `Размер: ${width}×${height} мм`;
            sheet.appendChild(item);
        }
        const sizeDisplay = document.createElement('div');
        sizeDisplay.className = 'size-display';
        if (formatSelect && !formatSelect.value)
            sizeDisplay.classList.add('custom-size');
        sizeDisplay.textContent = `${itemsPerSheet} шт. на листе`;
        sheet.appendChild(sizeDisplay);
    }
}

function showNotification(message, isTotalCost = false) {
    const notification = document.getElementById('notification');
    if (!notification)
        return;
    const notificationIcon = notification.querySelector('.notification-icon');
    const notificationTitle = notification.querySelector('.notification-title');
    const notificationText = notification.querySelector('#notificationCost');
    if (isTotalCost) {
        notificationIcon.innerHTML = '<i class="fas fa-shopping-cart"></i>';
        notificationTitle.textContent = 'Общая стоимость заказа';
    } else {
        notificationIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
        notificationTitle.textContent = 'Стоимость пересчитана';
    }
    notificationText.textContent = message;
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 5000);
}

function showDuplicateModal(product) {
    const modal = document.getElementById('duplicateModal');
    if (!modal)
        return;
    modal.style.display = 'flex';
    document.getElementById('modalCancel').onclick = function() { modal.style.display = 'none'; };
    document.getElementById('modalConfirm').onclick = function() { modal.style.display = 'none'; saveProduct(product); };
}

function checkVisitingCardSuggestion() {
    const width = parseInt(document.getElementById('width').value) || 0;
    const height = parseInt(document.getElementById('height').value) || 0;
    const productType = document.getElementById('productType').value;
    const isVisitingCardSize = (width === 90 && height === 50) || (width === 50 && height === 90);
    if (isVisitingCardSize && productType === 'sheet')
        showVisitingCardSuggestion();
}

function showVisitingCardSuggestion() {
    const modal = document.getElementById('visitingCardSuggestionModal');
    if (!modal)
        return;
    modal.style.display = 'flex';
    document.getElementById('visitingSuggestionCancel').onclick = function() { modal.style.display = 'none'; };
    document.getElementById('visitingSuggestionConfirm').onclick = function() {
        const currentQuantity = parseInt(document.getElementById('quantity').value) || 100;
        let visitingQuantity = Math.max(96, Math.ceil(currentQuantity / 24) * 24);
        document.getElementById('productType').value = 'visiting';
        updateProductName('visiting');
        toggleFieldsVisibility('visiting');
        updateVisibility();
        document.getElementById('visitingQuantity').value = visitingQuantity;
        calculateCost();
        modal.style.display = 'none';
        showNotification(`Переключено на визитки. Количество: ${visitingQuantity} шт.`);
    };
}

// =============================================
// ФУНКЦИИ ОТОБРАЖЕНИЯ РЕЗУЛЬТАТОВ
// =============================================

function displayCostResults(costResult, product) {
    if (!costResult)
        return;
    let totalCost = costResult.totalCost < MINIMAL_ORDER_COST ? MINIMAL_ORDER_COST : costResult.totalCost;
    document.getElementById('currentCostValue').textContent = `${totalCost.toFixed(2)} руб.`;
    document.getElementById('minimalCostNote').style.display = costResult.totalCost < MINIMAL_ORDER_COST ? 'block' : 'none';
    const saveButton = document.getElementById('saveProductBtn');
    if (saveButton)
        saveButton.setAttribute('data-tooltip', `Стоимость: ${totalCost.toFixed(2)} руб.`);
    switch (product.type) {
        case 'visiting': displayVisitingCardResults(costResult); break;
        case 'booklet': displayRefletResults(costResult); break;
        case 'book': displayBookResults(costResult, product); break; // Передаем product для проверки чекбокса
        default: displaySheetResults(costResult);
    }
    if (product.type !== 'book')
        renderSheetLayout(costResult.itemsPerSheet, product.type, product.width, product.height);
}

function resetCostDisplay() {
    const costItems = [
        'embossingCostItem',
        'dieCuttingCostItem',
        'laminationCostItem',
        'scoringCostItem',
        'foldingCostItem',
        'cornerRoundingCostItem',
        'numberingCostItem',
        'perforationCostItem',
        'gluingCostItem',
        'bindingCostItem',
        'bookletScoringCostItem',
        'bookBodyCostItem',
        'bookCoverCostItem',
        'bookBindingCostItem'
    ];
    costItems.forEach(itemId => {
        const element = document.getElementById(itemId);
        if (element)
            element.style.display = 'none';
    });
    document.getElementById('colorCost').textContent = '0 руб.';
    document.getElementById('paperCost').textContent = '0 руб.';
    document.getElementById('cuttingCost').textContent = '0 руб.';
    document.getElementById('itemsPerSheet').textContent = '0';
    document.getElementById('sheetsUsed').textContent = '0';
}

function displaySheetResults(costResult) {
    if (!costResult)
        return;
    document.getElementById('colorCost').textContent = `${costResult.costPrintOnly.toFixed(2)} руб.`;
    document.getElementById('paperCost').textContent = `${costResult.costPaperOnly.toFixed(2)} руб.`;
    document.getElementById('cuttingCost').textContent = `${costResult.itemRez.toFixed(2)} руб.`;
    const elements = {
        'embossingCost': costResult.embossingCost, 'dieCuttingCost': costResult.dieCuttingCost,
        'laminationCost': costResult.laminationCost, 'scoringCost': costResult.scoringCost,
        'foldingCost': costResult.foldingCost, 'cornerRoundingCost': costResult.cornerRoundingCost,
        'numberingCost': costResult.numberingCost, 'perforationCost': costResult.perforationCost,
        'gluingCost': costResult.gluingCost, 'bindingCost': costResult.bindingCost
    };
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        const itemElement = document.getElementById(id + 'Item');
        if (element && itemElement) {
            element.textContent = `${value.toFixed(2)} руб.`;
            itemElement.style.display = value > 0 ? 'flex' : 'none';
        }
    });
    document.getElementById('itemsPerSheet').textContent = costResult.itemsPerSheet;
    document.getElementById('sheetsUsed').textContent = costResult.sheetsUsed;
}

function displayVisitingCardResults(costResult) {
    if (!costResult)
        return;
    document.getElementById('colorCost').textContent = `${costResult.costPrintOnly.toFixed(2)} руб.`;
    document.getElementById('paperCost').textContent = '0 руб.';
    document.getElementById('cuttingCost').textContent = '0 руб.';
    if (costResult.cornerRoundingCost > 0) {
        document.getElementById('cornerRoundingCost').textContent = `${costResult.cornerRoundingCost.toFixed(2)} руб.`;
        document.getElementById('cornerRoundingCostItem').style.display = 'flex';
    }
    else
        document.getElementById('cornerRoundingCostItem').style.display = 'none';
    document.getElementById('itemsPerSheet').textContent = '24';
    document.getElementById('sheetsUsed').textContent = costResult.sheetsUsed;
}

function displayRefletResults(costResult) {
    if (!costResult)
        return;
    document.getElementById('colorCost').textContent = `${costResult.costPrintOnly.toFixed(2)} руб.`;
    document.getElementById('paperCost').textContent = `${costResult.costPaperOnly.toFixed(2)} руб.`;
    document.getElementById('cuttingCost').textContent = `${costResult.itemRez.toFixed(2)} руб.`;
    document.getElementById('bookletScoringCost').textContent = `${costResult.bookletScoringCost.toFixed(2)} руб.`;
    document.getElementById('bookletScoringCostItem').style.display = 'flex';
    const elements = { 'embossingCost': costResult.embossingCost, 'laminationCost': costResult.laminationCost };
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        const itemElement = document.getElementById(id + 'Item');
        if (element && itemElement) {
            element.textContent = `${value.toFixed(2)} руб.`;
            itemElement.style.display = value > 0 ? 'flex' : 'none';
        }
    });
    document.getElementById('itemsPerSheet').textContent = costResult.itemsPerSheet;
    document.getElementById('sheetsUsed').textContent = costResult.sheetsUsed;
}

function displayBookResults(costResult, product) {
    if (!costResult)
        return;
    // Сбрасываем все элементы стоимости
    resetCostDisplay();
    // Отображаем стоимость тела книги
    if (costResult.bodyCost > 0) {
        document.getElementById('bookBodyCost').textContent = `${costResult.bodyCost.toFixed(2)} руб.`;
        document.getElementById('bookBodyCostItem').style.display = 'flex';
    }
    // Отображаем информацию об обложке - либо стоимость, либо "нет"
    const coverNotRequired = document.getElementById('bookCoverNotRequired').checked;
    if (!coverNotRequired && costResult.coverCost > 0) {
        document.getElementById('bookCoverCost').textContent = `${costResult.coverCost.toFixed(2)} руб.`;
        document.getElementById('bookCoverCostItem').style.display = 'flex';
    } else if (coverNotRequired) {
        // Создаем элемент для отображения "Обложка: нет"
        document.getElementById('bookCoverCost').textContent = 'нет';
        document.getElementById('bookCoverCostItem').style.display = 'flex';
    }
    // ВСЕГДА отображаем стоимость переплета
    document.getElementById('bookBindingCost').textContent = `${costResult.bindingCost.toFixed(2)} руб.`;
    document.getElementById('bookBindingCostItem').style.display = 'flex';
    document.getElementById('itemsPerSheet').textContent = '1';
    document.getElementById('sheetsUsed').textContent = costResult.sheetsUsed;
}
