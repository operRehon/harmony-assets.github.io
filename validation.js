
// =============================================
// ФУНКЦИИ ИНТЕРФЕЙСА И ВАЛИДАЦИИ
// =============================================

function setupAllButtons() {
    const allButtons = {
        'embossingAllButton': 'embossingHits', 'dieCuttingAllButton': 'dieCuttingHits',
        'cornerRoundingAllButton': 'cornerRoundingSheets', 'numberingAllButton': 'numberingSheets',
        'perforationAllButton': 'perforationSheets', 'gluingAllButton': 'gluingSheets',
        'visitingCornerRoundingAllButton': 'visitingCornerRoundingSheets', 'bookletEmbossingAllButton': 'bookletEmbossingHits'
    };
    Object.entries(allButtons).forEach(([buttonId, inputId]) => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', function() {
                const productType = document.getElementById('productType').value;
                const quantityField = productType === 'visiting' ? 'visitingQuantity' : 
                                    productType === 'booklet' ? 'bookletQuantity' : 'quantity';
                const quantity = parseInt(document.getElementById(quantityField).value) || 0;
                if (inputId.includes('Hits') && quantity < 20) {
                    showNotification("Количество листов меньше 20. Значение не изменено.");
                    return;
                }
                const input = document.getElementById(inputId);
                if (input) {
                    input.value = quantity;
                    calculateCost();
                }
            });
        }
    });
}

function setupVisitingQuantityControl() {
    const minusBtn = document.getElementById('visitingQuantityMinus');
    const plusBtn = document.getElementById('visitingQuantityPlus');
    const quantityInput = document.getElementById('visitingQuantity');
    if (minusBtn) minusBtn.addEventListener('click', function() {
        let currentValue = parseInt(quantityInput.value) || 96;
        if (currentValue > 96) {
            quantityInput.value = Math.max(96, currentValue - 24);
            calculateCost();
        }
    });
    if (plusBtn) plusBtn.addEventListener('click', function() {
        let currentValue = parseInt(quantityInput.value) || 96;
        quantityInput.value = currentValue + 24; calculateCost();
    });
    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value) || 96;
            if (value < 96)
                value = 96;
            value = Math.max(96, Math.ceil(value / 24) * 24);
            this.value = value; calculateCost();
        });
        quantityInput.addEventListener('input', function() {
            let value = parseInt(this.value) || 96;
            if (value < 96)
                value = 96;
        });
        quantityInput.addEventListener('blur', function() {
            let value = parseInt(this.value) || 96;
            if (value < 96)
                value = 96;
            value = Math.max(96, Math.ceil(value / 24) * 24);
            this.value = value; calculateCost();
        });
    }
}

function checkBindingAvailability() {
    const bindingRequired = document.getElementById('bindingRequired');
    if (!bindingRequired)
        return;
    const bindingType = document.getElementById('bindingType') ? document.getElementById('bindingType').value : 'staple';
    const format = parseInt(document.getElementById('formatType').value);
    if (bindingRequired.checked && bindingType === 'spiral' && format !== 1 && format !== 2) {
        showNotification("Переплет пружиной доступен только для форматов А3 и А4!");
        if (document.getElementById('bindingType')) document.getElementById('bindingType').value = 'staple';
        const spiralOptions = document.getElementById('spiralOptions');
        const stapleOptions = document.getElementById('stapleOptions');
        if (spiralOptions) spiralOptions.style.display = 'none';
        if (stapleOptions) stapleOptions.style.display = 'block';
    }
}

function checkGluingAvailability() {
    const format = parseInt(document.getElementById('formatType').value);
    const gluingCheckbox = document.getElementById('gluingRequired');
    if (gluingCheckbox) {
        if (format !== 2 && format !== 3) {
            if (gluingCheckbox.checked) {
                gluingCheckbox.checked = false;
                const gluingOptions = document.getElementById('gluingOptions');
                if (gluingOptions)
                    gluingOptions.style.display = 'none';
                showNotification("Склейка доступна только для форматов А4 и А5!");
            }
            gluingCheckbox.disabled = true;
            gluingCheckbox.parentElement.style.opacity = '0.5';
        } else {
            gluingCheckbox.disabled = false;
            gluingCheckbox.parentElement.style.opacity = '1';
        }
    }
}

function updateBookBindingOptions() {
    const coverNotRequired = document.getElementById('bookCoverNotRequired').checked;
    const coverPaperType = document.getElementById('bookCoverPaperType').value;
    const bindingTypeSelect = document.getElementById('bookBindingType');
    if (!bindingTypeSelect)
        return;
    // Сохраняем текущее значение
    const currentValue = bindingTypeSelect.value;
    // Очищаем опции
    bindingTypeSelect.innerHTML = '';
    if (coverNotRequired) {
        // Если обложка не требуется - все типы переплета доступны
        bindingTypeSelect.innerHTML = `
            <option value="hard">Твердый переплет</option>
            <option value="soft">Мягкий переплет</option>
            <option value="staple" selected>Скрепка</option>
        `;
    } else if (coverPaperType === '2') { // 115 г/м²
        // Для бумаги 115 г/м² - только твердый переплет и скрепка
        bindingTypeSelect.innerHTML = `
            <option value="hard">Твердый переплет</option>
            <option value="staple" selected>Скрепка</option>
        `;
    } else {
        // Для другой бумаги - только мягкий переплет и скрепка
        bindingTypeSelect.innerHTML = `
            <option value="soft">Мягкий переплет</option>
            <option value="staple" selected>Скрепка</option>
        `;
    }
    // Восстанавливаем предыдущее значение, если оно доступно
    if (Array.from(bindingTypeSelect.options).some(opt => opt.value === currentValue))
        bindingTypeSelect.value = currentValue;
}
