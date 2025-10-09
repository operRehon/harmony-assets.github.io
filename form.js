
// =============================================
// ФУНКЦИИ РАБОТЫ С ФОРМОЙ И ДАННЫМИ
// =============================================

function handleSizeChange() {
    const width = parseInt(document.getElementById('width').value) || 0;
    const height = parseInt(document.getElementById('height').value) || 0;
    const detectedFormat = detectFormatBySize(width, height);
    const formatSelect = document.getElementById('formatType');
    if (detectedFormat && formatSelect) {
        formatSelect.value = detectedFormat;
        document.getElementById('width').value = FORMAT_SIZES[detectedFormat].width;
        document.getElementById('height').value = FORMAT_SIZES[detectedFormat].height;
    }
    else if (width > 0 && height > 0)
        formatSelect.value = "";
    calculateCost();
}

function handleFormatChange() {
    const formatSelect = document.getElementById('formatType');
    const formatValue = formatSelect.value;
    if (formatValue && FORMAT_SIZES[formatValue]) {
        document.getElementById('width').value = FORMAT_SIZES[formatValue].width;
        document.getElementById('height').value = FORMAT_SIZES[formatValue].height;
    } else if (!formatValue) {
        const width = document.getElementById('width').value || 0;
        const height = document.getElementById('height').value || 0;
        if (!width || !height) {
            document.getElementById('width').value = 297;
            document.getElementById('height').value = 210;
        }
    }
    checkBindingAvailability();
    checkGluingAvailability();
    calculateCost();
}

function getFormData() {
    const productType = document.getElementById('productType').value;
    const isVisiting = productType === 'visiting';
    const isBooklet = productType === 'booklet';
    const isBook = productType === 'book';
    let data = {
        id: document.getElementById('productId').value || generateId(),
        type: productType,
        name: document.getElementById('productName').value || `${getProductTypeName(productType)} ${productCounter[productType] || 1}`,
        kras: isVisiting ? parseInt(document.getElementById('visitingColorType').value) : 
              isBooklet ? parseInt(document.getElementById('bookletColorType').value) :
              isBook ? 0 : // Для книг kras не используется
              parseInt(document.getElementById('colorType').value) || 1,
        item: isVisiting ? (function() {
            let visitingQuantity = parseInt(document.getElementById('visitingQuantity').value) || 96;
            if (visitingQuantity % 24 !== 0)
                visitingQuantity = Math.ceil(visitingQuantity / 24) * 24;
            if (visitingQuantity < 96)
                visitingQuantity = 96;
            return visitingQuantity;
        })() : isBooklet ? parseInt(document.getElementById('bookletQuantity').value) || 100 :
              isBook ? 0 : // Для книг item не используется
              parseInt(document.getElementById('quantity').value) || 100,
        razmer: isVisiting ? 0 : isBooklet ? 2 : isBook ? 0 : parseInt(document.getElementById('formatType').value) || 3,
        pap: isVisiting ? parseInt(document.getElementById('visitingPaperType').value) : 
             isBooklet ? parseInt(document.getElementById('bookletPaperType').value) :
             isBook ? 0 : // Для книг pap не используется
             parseInt(document.getElementById('paperType').value) || 2,
        width: isVisiting ? 50 : isBooklet ? 210 : isBook ? 0 : parseInt(document.getElementById('width').value) || 0,
        height: isVisiting ? 90 : isBooklet ? 297 : isBook ? 0 : parseInt(document.getElementById('height').value) || 0,
        postprintRequired: document.getElementById('postprintRequired') ? document.getElementById('postprintRequired').checked : false
    };
    if (productType === 'book') {
        data.bookQuantity = parseInt(document.getElementById('bookQuantity').value) || 10;
        data.bookBodyColorType = parseInt(document.getElementById('bookBodyColorType').value) || 4;
        data.bookBodyFormat = parseInt(document.getElementById('bookBodyFormat').value) || 2;
        data.bookBodySheets = parseInt(document.getElementById('bookBodySheets').value) || 1;
        data.bookBodyPaperType = parseInt(document.getElementById('bookBodyPaperType').value) || 1;
        data.bookCoverNotRequired = document.getElementById('bookCoverNotRequired').checked;
        data.bookCoverColorType = parseInt(document.getElementById('bookCoverColorType').value) || 4;
        data.bookCoverPaperType = parseInt(document.getElementById('bookCoverPaperType').value) || 1;
        data.bookCoverLaminationType = parseInt(document.getElementById('bookCoverLaminationType').value) || 0;
        data.bookBindingType = document.getElementById('bookBindingType').value;
    }
    if (isBooklet) {
        const bookletSize = document.querySelector('input[name="bookletSize"]:checked');
        data.bookletSize = bookletSize ? bookletSize.value : 'A4';
        if (data.bookletSize === 'A3') {
            data.width = 297;
            data.height = 420;
            data.razmer = 1;
        } 
        else {
            data.width = 210;
            data.height = 297;
            data.razmer = 2;
        }
        data.bookletEmbossingRequired = document.getElementById('bookletEmbossingRequired').checked;
        data.bookletEmbossingHits = parseInt(document.getElementById('bookletEmbossingHits').value) || 0;
        data.bookletLaminationRequired = document.getElementById('bookletLaminationRequired').checked;
        data.bookletLaminationType = parseInt(document.getElementById('bookletLaminationType').value) || 1;
    }
    if (!data.postprintRequired && productType !== 'booklet' && productType !== 'book') {
        const postprintOptions = [
            'embossing',
            'dieCutting',
            'lamination',
            'scoring',
            'folding',
            'cornerRounding',
            'numbering',
            'perforation',
            'gluing',
            'binding'];
        postprintOptions.forEach(option => { data[option + 'Required'] = false; });
    } else if (data.postprintRequired && productType !== 'book') {
        data.embossingRequired = document.getElementById('embossingRequired').checked;
        data.embossingHits = parseInt(document.getElementById('embossingHits').value) || 0;
        data.dieCuttingRequired = document.getElementById('dieCuttingRequired').checked;
        data.dieCuttingHits = parseInt(document.getElementById('dieCuttingHits').value) || 0;
        data.laminationRequired = document.getElementById('laminationRequired').checked;
        data.laminationType = parseInt(document.getElementById('laminationType').value) || 1;
        data.scoringRequired = document.getElementById('scoringRequired').checked;
        data.scoringHits = parseInt(document.getElementById('scoringHits').value) || 0;
        data.foldingRequired = document.getElementById('foldingRequired').checked;
        data.foldingHits = parseInt(document.getElementById('foldingHits').value) || 0;
        data.cornerRoundingRequired = document.getElementById('cornerRoundingRequired').checked;
        data.cornerRoundingSheets = parseInt(document.getElementById('cornerRoundingSheets').value) || 0;
        data.numberingRequired = document.getElementById('numberingRequired').checked;
        data.numberingSheets = parseInt(document.getElementById('numberingSheets').value) || 0;
        data.perforationRequired = document.getElementById('perforationRequired').checked;
        data.perforationSheets = parseInt(document.getElementById('perforationSheets').value) || 0;
        data.gluingRequired = document.getElementById('gluingRequired').checked;
        data.gluingSheets = parseInt(document.getElementById('gluingSheets').value) || 0;
        data.bindingRequired = document.getElementById('bindingRequired').checked;
        data.bindingType = document.getElementById('bindingType') ? document.getElementById('bindingType').value : 'staple';
        data.bindingSheets = parseInt(document.getElementById('bindingSheets').value) || 0;
        data.bindingCount = parseInt(document.getElementById('bindingCount').value) || 1;
        data.bindingWithCover = document.getElementById('bindingWithCover') ? document.getElementById('bindingWithCover').checked : false;
        data.stapleBindingCount = parseInt(document.getElementById('stapleBindingCount').value) || 1;
    }
    if (isVisiting) {
        data.visitingCornerRoundingRequired = document.getElementById('visitingCornerRoundingRequired').checked;
        data.visitingCornerRoundingSheets = parseInt(document.getElementById('visitingCornerRoundingSheets').value) || 0;
        data.visitingLaminationRequired = document.getElementById('visitingLaminationRequired').checked;
        data.visitingLaminationType = parseInt(document.getElementById('visitingLaminationType').value) || 1;
    }
    return data;
}

function fillForm(product) {
    if (!product) return;
    document.getElementById('productId').value = product.id;
    document.getElementById('productType').value = product.type;
    document.getElementById('productName').value = product.name;
    if (product.type === 'visiting') {
        document.getElementById('visitingColorType').value = product.kras;
        document.getElementById('visitingQuantity').value = product.item;
        document.getElementById('visitingPaperType').value = product.pap;
        document.getElementById('visitingCornerRoundingRequired').checked = product.visitingCornerRoundingRequired || false;
        document.getElementById('visitingCornerRoundingSheets').value = product.visitingCornerRoundingSheets || 0;
        document.getElementById('visitingLaminationRequired').checked = product.visitingLaminationRequired || false;
        document.getElementById('visitingLaminationType').value = product.visitingLaminationType || 1;
    } else if (product.type === 'booklet') {
        document.getElementById('bookletColorType').value = product.kras;
        document.getElementById('bookletQuantity').value = product.item;
        document.getElementById('bookletPaperType').value = product.pap;
        const sizeRadios = document.querySelectorAll('input[name="bookletSize"]');
        sizeRadios.forEach(radio => { if (radio.value === product.bookletSize) radio.checked = true; });
        document.getElementById('bookletEmbossingRequired').checked = product.bookletEmbossingRequired || false;
        document.getElementById('bookletEmbossingHits').value = product.bookletEmbossingHits || 0;
        document.getElementById('bookletLaminationRequired').checked = product.bookletLaminationRequired || false;
        document.getElementById('bookletLaminationType').value = product.bookletLaminationType || 1;
    } else if (product.type === 'book') {
        document.getElementById('bookQuantity').value = product.bookQuantity || 10;
        document.getElementById('bookBodyColorType').value = product.bookBodyColorType || 4;
        document.getElementById('bookBodyFormat').value = product.bookBodyFormat || 2;
        document.getElementById('bookBodySheets').value = product.bookBodySheets || 1;
        document.getElementById('bookBodyPaperType').value = product.bookBodyPaperType || 1;
        document.getElementById('bookCoverNotRequired').checked = product.bookCoverNotRequired || false;
        document.getElementById('bookCoverColorType').value = product.bookCoverColorType || 4;
        document.getElementById('bookCoverPaperType').value = product.bookCoverPaperType || 2; // 115 по умолчанию
        document.getElementById('bookCoverLaminationType').value = product.bookCoverLaminationType || 0; // Нет по умолчанию
        document.getElementById('bookBindingType').value = product.bookBindingType || 'staple';
    } else {
        document.getElementById('colorType').value = product.kras;
        document.getElementById('quantity').value = product.item;
        document.getElementById('formatType').value = product.razmer;
        document.getElementById('paperType').value = product.pap;
        document.getElementById('width').value = product.width;
        document.getElementById('height').value = product.height;
    }
    document.getElementById('postprintRequired').checked = product.postprintRequired || false;
    if (product.postprintRequired && product.type !== 'book') {
        document.getElementById('embossingRequired').checked = product.embossingRequired || false;
        document.getElementById('embossingHits').value = product.embossingHits || 0;
        document.getElementById('dieCuttingRequired').checked = product.dieCuttingRequired || false;
        document.getElementById('dieCuttingHits').value = product.dieCuttingHits || 0;
        document.getElementById('laminationRequired').checked = product.laminationRequired || false;
        document.getElementById('laminationType').value = product.laminationType || 1;
        document.getElementById('scoringRequired').checked = product.scoringRequired || false;
        document.getElementById('scoringHits').value = product.scoringHits || 0;
        document.getElementById('foldingRequired').checked = product.foldingRequired || false;
        document.getElementById('foldingHits').value = product.foldingHits || 0;
        document.getElementById('cornerRoundingRequired').checked = product.cornerRoundingRequired || false;
        document.getElementById('cornerRoundingSheets').value = product.cornerRoundingSheets || 0;
        document.getElementById('numberingRequired').checked = product.numberingRequired || false;
        document.getElementById('numberingSheets').value = product.numberingSheets || 0;
        document.getElementById('perforationRequired').checked = product.perforationRequired || false;
        document.getElementById('perforationSheets').value = product.perforationSheets || 0;
        document.getElementById('gluingRequired').checked = product.gluingRequired || false;
        document.getElementById('gluingSheets').value = product.gluingSheets || 0;
        document.getElementById('bindingRequired').checked = product.bindingRequired || false;
        document.getElementById('bindingSheets').value = product.bindingSheets || 0;
        document.getElementById('bindingCount').value = product.bindingCount || 1;
        document.getElementById('bindingWithCover').checked = product.bindingWithCover || false;
        if (document.getElementById('bindingType')) document.getElementById('bindingType').value = product.bindingType || 'staple';
        document.getElementById('stapleBindingCount').value = product.stapleBindingCount || 1;
    }
    currentProductId = product.id;
    updateVisibility();
}

function updateVisibility() {
    const productType = document.getElementById('productType').value;
    const postprintRequired = document.getElementById('postprintRequired').checked;
    const postprintOptions = document.getElementById('postprintOptions');
    if (postprintOptions) postprintOptions.style.display = (postprintRequired && productType !== 'book') ? 'block' : 'none';
    const options = [
        'embossing',
        'dieCutting',
        'lamination',
        'scoring',
        'folding',
        'cornerRounding',
        'numbering',
        'perforation',
        'gluing',
        'binding',
        'visitingCornerRounding',
        'bookletEmbossing',
        'bookletLamination',
        'visitingLamination'];
    options.forEach(option => {
        const checkbox = document.getElementById(option + 'Required');
        const optionsDiv = document.getElementById(option + 'Options');
        if (checkbox && optionsDiv)
            optionsDiv.style.display = checkbox.checked ? 'block' : 'none';
    });
    if (productType === 'book')
        updateBookBindingOptions();
    const visitingPaperType = document.getElementById('visitingPaperType');
    const visitingLaminationRequired = document.getElementById('visitingLaminationRequired');
    const visitingLaminationOptions = document.getElementById('visitingLaminationOptions');
    if (visitingPaperType && visitingLaminationRequired && visitingLaminationOptions) {
        const isLaminationAvailable = visitingPaperType.value === '10'; // 300 г/м²
        if (!isLaminationAvailable) {
            visitingLaminationRequired.checked = false;
            visitingLaminationOptions.style.display = 'none';
        }
        visitingLaminationRequired.disabled = !isLaminationAvailable;
        visitingLaminationRequired.parentElement.style.opacity = isLaminationAvailable ? '1' : '0.5';
        if (isLaminationAvailable && visitingLaminationRequired.checked)
            visitingLaminationOptions.style.display = 'block';
    }
    const bindingType = document.getElementById('bindingType') ? document.getElementById('bindingType').value : 'staple';
    const spiralOptions = document.getElementById('spiralOptions');
    const stapleOptions = document.getElementById('stapleOptions');
    if (spiralOptions)
        spiralOptions.style.display = bindingType === 'spiral' ? 'block' : 'none';
    if (stapleOptions)
        stapleOptions.style.display = bindingType === 'staple' ? 'block' : 'none';
    checkBindingAvailability();
    checkGluingAvailability();
    setTimeout(calculateCost, 10);
}

function updateProductName(productType) {
    const nameField = document.getElementById('productName');
    if (nameField && (!nameField.value || nameField.value.includes('Листовая печать') || 
        nameField.value.includes('Визитки') || nameField.value.includes('Лифлеты') || nameField.value.includes('Книги'))) {
        nameField.value = `${getProductTypeName(productType)} ${productCounter[productType] || 1}`;
    }
}

function toggleFieldsVisibility(productType) {
    document.body.classList.remove('visiting-card-selected', 'booklet-selected', 'book-selected');
    resetCostDisplay();
    if (productType === 'visiting') {
        document.body.classList.add('visiting-card-selected');
        const quantityGroup = document.querySelector('.form-group:has(#quantity)');
        if (quantityGroup)
            quantityGroup.style.display = 'none';
        const bookletQuantityGroup = document.querySelector('.form-group:has(#bookletQuantity)');
        if (bookletQuantityGroup)
            bookletQuantityGroup.style.display = 'none';
        const visitingQuantityGroup = document.querySelector('.form-group:has(#visitingQuantity)');
        if (visitingQuantityGroup)
            visitingQuantityGroup.style.display = 'block';
    } else if (productType === 'booklet') {
        document.body.classList.add('booklet-selected');
        const quantityGroup = document.querySelector('.form-group:has(#quantity)');
        if (quantityGroup)
            quantityGroup.style.display = 'none';
        const visitingQuantityGroup = document.querySelector('.form-group:has(#visitingQuantity)');
        if (visitingQuantityGroup)
            visitingQuantityGroup.style.display = 'none';
        const bookletQuantityGroup = document.querySelector('.form-group:has(#bookletQuantity)');
        if (bookletQuantityGroup)
            bookletQuantityGroup.style.display = 'block';
    } else if (productType === 'book') {
        document.body.classList.add('book-selected');
        const quantityGroup = document.querySelector('.form-group:has(#quantity)');
        if (quantityGroup)
            quantityGroup.style.display = 'none';
        const visitingQuantityGroup = document.querySelector('.form-group:has(#visitingQuantity)');
        if (visitingQuantityGroup)
            visitingQuantityGroup.style.display = 'none';
        const bookletQuantityGroup = document.querySelector('.form-group:has(#bookletQuantity)');
        if (bookletQuantityGroup)
            bookletQuantityGroup.style.display = 'none';
    } else {
        const quantityGroup = document.querySelector('.form-group:has(#quantity)');
        if (quantityGroup)
            quantityGroup.style.display = 'block';
        const visitingQuantityGroup = document.querySelector('.form-group:has(#visitingQuantity)');
        if (visitingQuantityGroup)
            visitingQuantityGroup.style.display = 'none';
        const bookletQuantityGroup = document.querySelector('.form-group:has(#bookletQuantity)');
        if (bookletQuantityGroup)
            bookletQuantityGroup.style.display = 'none';
    }
    updateContainerVisibility(productType);
}

function updateContainerVisibility(productType) {
    const mockupContainer = document.querySelector('.mockup-container');
    const resultContainer = document.querySelector('.result-container');
    if (mockupContainer && resultContainer) {
        if (productType === 'visiting') {
            mockupContainer.style.display = 'block';
            document.querySelector('.result-title').textContent = 'Стоимость визиток';
            setTimeout(() => { renderSheetLayout(24, 'visiting'); }, 10);
        } else if (productType === 'booklet') {
            mockupContainer.style.display = 'block';
            document.querySelector('.result-title').textContent = 'Стоимость лифлетов';
            setTimeout(() => {
                const product = getFormData();
                const costResult = calculateProductCost(product);
                renderSheetLayout(costResult.itemsPerSheet, 'booklet', product.width, product.height);
            }, 10);
        } else if (productType === 'book') {
            mockupContainer.style.display = 'block';
            document.querySelector('.result-title').textContent = 'Стоимость книги';
        } else {
            mockupContainer.style.display = 'block';
            document.querySelector('.result-title').textContent = 'Стоимость текущего изделия';
        }
    }
}
