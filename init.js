
// =============================================
// ИНИЦИАЛИЗАЦИЯ
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    loadProductCounterFromStorage();
    loadProductsFromStorage();
    const initialProductType = document.getElementById('productType').value;
    toggleFieldsVisibility(initialProductType);
    updateVisibility();
    setTimeout(() => { loadFormStateFromStorage(); }, 200);
    if (products.length === 0 && !localStorage.getItem(STORAGE_KEYS.FORM_STATE)) resetForm();
    setupAllButtons();
    setupVisitingQuantityControl();
    const formElementsForAutoSave = document.querySelectorAll('select, input, textarea');
    formElementsForAutoSave.forEach(element => {
        element.addEventListener('change', handleFormChange);
        element.addEventListener('input', handleFormChange);
    });
    document.getElementById('width')?.addEventListener('input', handleSizeChange);
    document.getElementById('height')?.addEventListener('input', handleSizeChange);
    document.querySelectorAll('input[name="bookletSize"]').forEach(radio => {
        radio.addEventListener('change', function() { calculateCost(); });
    });
    document.getElementById('productType')?.addEventListener('change', function() {
        const productType = this.value;
        updateProductName(productType);
        toggleFieldsVisibility(productType);
        updateVisibility();
        if (currentProductId === null) resetForm(); else calculateCost();
        setTimeout(() => {
            const product = getFormData();
            const costResult = calculateProductCost(product);
            // Для книг не отображаем макет
            if (productType !== 'book') {
                renderSheetLayout(costResult.itemsPerSheet, productType, product.width, product.height);
            }
        }, 10);
    });
    document.getElementById('visitingLaminationRequired')?.addEventListener('change', function() { 
        updateVisibility(); 
        calculateCost(); 
    });
    document.getElementById('visitingLaminationType')?.addEventListener('change', function() { 
        calculateCost(); 
    });
    document.getElementById('visitingPaperType')?.addEventListener('change', function() { 
        updateVisibility(); 
        calculateCost(); 
    });
    document.getElementById('visitingLaminationRequired')?.addEventListener('change', function() { 
        updateVisibility(); 
        calculateCost(); 
    });
    document.getElementById('visitingLaminationType')?.addEventListener('change', function() { 
        calculateCost(); 
    });
    document.getElementById('visitingPaperType')?.addEventListener('change', function() { 
        updateVisibility(); 
        calculateCost(); 
    });
    document.getElementById('bookCoverNotRequired')?.addEventListener('change', function() {
        const coverOptions = document.getElementById('bookCoverOptions');
        if (coverOptions) {
            if (this.checked) {
                coverOptions.style.opacity = '0.5';
                coverOptions.style.pointerEvents = 'none';
            } else {
                coverOptions.style.opacity = '1';
                coverOptions.style.pointerEvents = 'all';
            }
        }
        calculateCost();
    });
    document.getElementById('bookQuantity')?.addEventListener('change', function() {
        const value = parseInt(this.value) || 10;
        const errorElement = document.getElementById('bookQuantityError');
        if (value < 10) {
            this.value = 10;
            if (errorElement) errorElement.style.display = 'block';
            showNotification("Минимальный тираж книги - 10 экземпляров. Установлено значение 10.");
        } else { if (errorElement) errorElement.style.display = 'none'; }
        calculateCost();
    });
    document.getElementById('bookBodySheets')?.addEventListener('change', function() {
        const value = parseInt(this.value) || 5;
        const errorElement = document.getElementById('bookBodySheetsError');
        if (value < 5) {
            this.value = 5;
            if (errorElement) errorElement.style.display = 'block';
            showNotification("Минимальное количество листов в книге - 5. Установлено значение 5.");
        } else { if (errorElement) errorElement.style.display = 'none'; }
        calculateCost();
    });
    // Обработчики для книг
    document.getElementById('bookCoverNotRequired')?.addEventListener('change', function() {
        const coverOptions = document.getElementById('bookCoverOptions');
        if (coverOptions) {
            if (this.checked) {
                coverOptions.style.opacity = '0.5';
                coverOptions.style.pointerEvents = 'none';
            } else {
                coverOptions.style.opacity = '1';
                coverOptions.style.pointerEvents = 'all';
            }
        }
        updateBookBindingOptions();
        calculateCost();
    });
    document.getElementById('bookCoverPaperType')?.addEventListener('change', function() {
        updateBookBindingOptions();
        calculateCost();
    });
    // Инициализируйте состояние при загрузке
    const bookCoverNotRequired = document.getElementById('bookCoverNotRequired');
    const coverOptions = document.getElementById('bookCoverOptions');
    if (bookCoverNotRequired && coverOptions) {
        if (bookCoverNotRequired.checked) {
            coverOptions.style.opacity = '0.5';
            coverOptions.style.pointerEvents = 'none';
        }
    }
    // Инициализируем опции переплета при загрузке
    updateBookBindingOptions();
    document.getElementById('formatType')?.addEventListener('change', handleFormatChange);
    document.getElementById('bindingType')?.addEventListener('change', function() { updateVisibility(); calculateCost(); });
    document.getElementById('postprintRequired')?.addEventListener('change', function() { updateVisibility(); calculateCost(); });
    document.getElementById('bookletEmbossingRequired')?.addEventListener('change', function() { updateVisibility(); calculateCost(); });
    document.getElementById('bookletLaminationRequired')?.addEventListener('change', function() { updateVisibility(); calculateCost(); });
    const postprintCheckboxes = ['embossing', 'dieCutting', 'lamination', 'scoring', 'folding', 'cornerRounding', 'numbering', 'perforation', 'gluing', 'binding', 'visitingLamination', 'visitingCornerRounding'];
    postprintCheckboxes.forEach(option => {
        const checkbox = document.getElementById(option + 'Required');
        if (checkbox) checkbox.addEventListener('change', function() { updateVisibility(); calculateCost(); });
    });
    const formElementsForCalc = document.querySelectorAll('select, input[type="number"], input[type="text"]');
    formElementsForCalc.forEach(element => {
        element.addEventListener('change', calculateCost);
        element.addEventListener('input', calculateCost);
    });
    document.getElementById('saveProductBtn')?.addEventListener('click', addProduct);
    document.querySelector('.notification-close')?.addEventListener('click', function() {
        document.getElementById('notification').classList.remove('show');
    });
    document.getElementById('width')?.addEventListener('change', function() { setTimeout(checkVisitingCardSuggestion, 100); });
    document.getElementById('height')?.addEventListener('change', function() { setTimeout(checkVisitingCardSuggestion, 100); });
    calculateCost();
    renderProductsList();
    if (products.length > 0) showNotification(`Загружено ${products.length} изделий`, true);
});