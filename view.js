
// =============================================
// ФУНКЦИИ ОТОБРАЖЕНИЯ РЕЗУЛЬТАТОВ
// =============================================
function displayCostResults(costResult, product) {
    if (!costResult) return;
    let totalCost = costResult.totalCost < MINIMAL_ORDER_COST ? MINIMAL_ORDER_COST : costResult.totalCost;
    document.getElementById('currentCostValue').textContent = `${totalCost.toFixed(2)} руб.`;
    document.getElementById('minimalCostNote').style.display = costResult.totalCost < MINIMAL_ORDER_COST ? 'block' : 'none';
    const saveButton = document.getElementById('saveProductBtn');
    if (saveButton) saveButton.setAttribute('data-tooltip', `Стоимость: ${totalCost.toFixed(2)} руб.`);
    switch (product.type) {
        case 'visiting': displayVisitingCardResults(costResult); break;
        case 'booklet': displayRefletResults(costResult); break;
        case 'book': displayBookResults(costResult, product); break; // Передаем product для проверки чекбокса
        default: displaySheetResults(costResult);
    }
    if (product.type !== 'book') renderSheetLayout(costResult.itemsPerSheet, product.type, product.width, product.height);
}
function resetCostDisplay() {
    const costItems = [
        'embossingCostItem', 'dieCuttingCostItem', 'laminationCostItem', 
        'scoringCostItem', 'foldingCostItem', 'cornerRoundingCostItem', 
        'numberingCostItem', 'perforationCostItem', 'gluingCostItem', 
        'bindingCostItem', 'bookletScoringCostItem', 'bookBodyCostItem', 
        'bookCoverCostItem', 'bookBindingCostItem'
    ];
    costItems.forEach(itemId => {
        const element = document.getElementById(itemId);
        if (element) element.style.display = 'none';
    });
    document.getElementById('colorCost').textContent = '0 руб.';
    document.getElementById('paperCost').textContent = '0 руб.';
    document.getElementById('cuttingCost').textContent = '0 руб.';
    document.getElementById('itemsPerSheet').textContent = '0';
    document.getElementById('sheetsUsed').textContent = '0';
}
function displaySheetResults(costResult) {
    if (!costResult) return;
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
    if (!costResult) return;
    document.getElementById('colorCost').textContent = `${costResult.costPrintOnly.toFixed(2)} руб.`;
    document.getElementById('paperCost').textContent = '0 руб.';
    document.getElementById('cuttingCost').textContent = '0 руб.';
    if (costResult.cornerRoundingCost > 0) {
        document.getElementById('cornerRoundingCost').textContent = `${costResult.cornerRoundingCost.toFixed(2)} руб.`;
        document.getElementById('cornerRoundingCostItem').style.display = 'flex';
    } else document.getElementById('cornerRoundingCostItem').style.display = 'none';
    document.getElementById('itemsPerSheet').textContent = '24';
    document.getElementById('sheetsUsed').textContent = costResult.sheetsUsed;
}
function displayRefletResults(costResult) {
    if (!costResult) return;
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
    if (!costResult) return;
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