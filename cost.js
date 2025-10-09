
// =============================================
// ОСНОВНЫЕ ФУНКЦИИ РАСЧЕТА И ОБНОВЛЕНИЯ
// =============================================
function calculateCost() {
    try {
        resetCostDisplay();
        const product = getFormData();
        const costResult = calculateProductCost(product);
        displayCostResults(costResult, product);
        updateTotalCost();
        if (product.type !== 'book') {
            let width, height;
            if (product.type === 'booklet') {
                const bookletSize = product.bookletSize || 'A4';
                if (bookletSize === 'A3') { width = 297; height = 420; } 
                else { width = 210; height = 297; }
            } else if (product.type === 'visiting') { width = 50; height = 90; } 
            else {
                width = product.width || (FORMAT_SIZES[product.razmer] ? FORMAT_SIZES[product.razmer].width : 148);
                height = product.height || (FORMAT_SIZES[product.razmer] ? FORMAT_SIZES[product.razmer].height : 210);
            }
            renderSheetLayout(costResult.itemsPerSheet, product.type, width, height);
        }
    } catch (error) {
        console.error('Ошибка расчета стоимости:', error);
        document.getElementById('currentCostValue').textContent = 'Ошибка расчета';
    }
}
function updateTotalCost() {
    let totalCost = products.reduce((sum, product) => {
        const costResult = calculateProductCost(product);
        return sum + (costResult.totalCost < MINIMAL_ORDER_COST ? MINIMAL_ORDER_COST : costResult.totalCost);
    }, 0);
    document.getElementById('totalOrderCost').textContent = `${totalCost.toFixed(2)} руб.`;
    return totalCost;
}
function resetForm() {
    document.getElementById('productId').value = '';
    const productType = document.getElementById('productType').value;
    document.getElementById('productName').value = `${getProductTypeName(productType)} ${productCounter[productType] || 1}`;
    if (productType === 'visiting') {
        document.getElementById('visitingColorType').value = '1';
        document.getElementById('visitingQuantity').value = '96';
        document.getElementById('visitingPaperType').value = '10';
        document.getElementById('visitingCornerRoundingRequired').checked = false;
        document.getElementById('visitingCornerRoundingSheets').value = '0';
        document.getElementById('visitingLaminationRequired').checked = false;
        document.getElementById('visitingLaminationType').value = '1';
    } else if (productType === 'booklet') {
        document.getElementById('bookletColorType').value = '2';
        document.getElementById('bookletQuantity').value = '100';
        document.getElementById('bookletPaperType').value = '2';
        document.querySelector('input[name="bookletSize"][value="A4"]').checked = true;
        document.getElementById('bookletEmbossingRequired').checked = false;
        document.getElementById('bookletEmbossingHits').value = '0';
        document.getElementById('bookletLaminationRequired').checked = false;
        document.getElementById('bookletLaminationType').value = '1';
    } else if (productType === 'book') {
       document.getElementById('bookQuantity').value = '10';
        document.getElementById('bookBodyColorType').value = '4';
        document.getElementById('bookBodyFormat').value = '2';
        document.getElementById('bookBodySheets').value = '5';
        document.getElementById('bookBodyPaperType').value = '1';
        document.getElementById('bookCoverNotRequired').checked = false;
        document.getElementById('bookCoverColorType').value = '4';
        document.getElementById('bookCoverPaperType').value = '2'; // 115 г/м² по умолчанию
        document.getElementById('bookCoverLaminationType').value = '0'; // Нет ламинации по умолчанию
        document.getElementById('bookBindingType').value = 'staple'; // Скрепка по умолчанию
        const coverOptions = document.getElementById('bookCoverOptions');
        if (coverOptions) {
            coverOptions.style.opacity = '1';
            coverOptions.style.pointerEvents = 'all';
        }
        // Скрываем сообщения об ошибках
        document.getElementById('bookQuantityError').style.display = 'none';
        document.getElementById('bookBodySheetsError').style.display = 'none';
    } else {
        document.getElementById('colorType').value = '1';
        document.getElementById('quantity').value = '1';
        document.getElementById('formatType').value = '2';
        document.getElementById('paperType').value = '2';
        document.getElementById('width').value = '210';
        document.getElementById('height').value = '297';
    }
    document.getElementById('postprintRequired').checked = false;
    const postprintOptions = ['embossing', 'dieCutting', 'lamination', 'scoring', 'folding', 'cornerRounding', 'numbering', 'perforation', 'gluing', 'binding'];
    postprintOptions.forEach(option => {
        const checkbox = document.getElementById(option + 'Required');
        if (checkbox) checkbox.checked = false;
    });
    currentProductId = null;
    updateVisibility();
    calculateCost();
    setTimeout(saveFormStateToStorage, 100);
}
