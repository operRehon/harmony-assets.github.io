
// =============================================
// ФУНКЦИИ РАБОТЫ С LOCALSTORAGE
// =============================================

function saveProductsToStorage() {
    try { localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products)); } 
    catch (error) { console.error('Ошибка сохранения продуктов:', error); }
}

function loadProductsFromStorage() {
    try {
        const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
        if (savedProducts) {
            products = JSON.parse(savedProducts);
            return true;
        }
    } catch (error) { console.error('Ошибка загрузки продуктов:', error); }
    return false;
}

function saveProductCounterToStorage() {
    try { localStorage.setItem(STORAGE_KEYS.PRODUCT_COUNTER, JSON.stringify(productCounter)); } 
    catch (error) { console.error('Ошибка сохранения счетчика:', error); }
}

function loadProductCounterFromStorage() {
    try {
        const savedCounter = localStorage.getItem(STORAGE_KEYS.PRODUCT_COUNTER);
        if (savedCounter) {
            productCounter = JSON.parse(savedCounter);
            return true;
        }
    } catch (error) { console.error('Ошибка загрузки счетчика:', error); }
    return false;
}

function saveFormStateToStorage() {
    try {
        const formState = getFormData();
        delete formState.id;
        localStorage.setItem(STORAGE_KEYS.FORM_STATE, JSON.stringify(formState));
    } catch (error) { console.error('Ошибка сохранения состояния формы:', error); }
}

function loadFormStateFromStorage() {
    try {
        const savedFormState = localStorage.getItem(STORAGE_KEYS.FORM_STATE);
        if (savedFormState) {
            const formState = JSON.parse(savedFormState);
            fillFormFromState(formState);
            return true;
        }
    } catch (error) { console.error('Ошибка загрузки состояния формы:', error); }
    return false;
}

function fillFormFromState(formState) {
    if (!formState)
        return;
    if (formState.type) {
        document.getElementById('productType').value = formState.type;
        toggleFieldsVisibility(formState.type);
    }
    if (formState.name)
        document.getElementById('productName').value = formState.name;
    if (formState.type === 'visiting') {
        if (formState.kras)
            document.getElementById('visitingColorType').value = formState.kras;
        if (formState.item)
            document.getElementById('visitingQuantity').value = formState.item;
        if (formState.pap)
            document.getElementById('visitingPaperType').value = formState.pap;
        if (formState.visitingCornerRoundingRequired !== undefined)
            document.getElementById('visitingCornerRoundingRequired').checked = formState.visitingCornerRoundingRequired;
        if (formState.visitingCornerRoundingSheets)
            document.getElementById('visitingCornerRoundingSheets').value = formState.visitingCornerRoundingSheets;
    } else if (formState.type === 'booklet') {
        if (formState.kras)
            document.getElementById('bookletColorType').value = formState.kras;
        if (formState.item)
            document.getElementById('bookletQuantity').value = formState.item;
        if (formState.pap)
            document.getElementById('bookletPaperType').value = formState.pap;
        if (formState.bookletSize) {
            const sizeRadios = document.querySelectorAll('input[name="bookletSize"]');
            sizeRadios.forEach(radio => { if (radio.value === formState.bookletSize) radio.checked = true; });
        }
        if (formState.bookletEmbossingRequired !== undefined)
            document.getElementById('bookletEmbossingRequired').checked = formState.bookletEmbossingRequired;
        if (formState.bookletEmbossingHits)
            document.getElementById('bookletEmbossingHits').value = formState.bookletEmbossingHits;
        if (formState.bookletLaminationRequired !== undefined)
            document.getElementById('bookletLaminationRequired').checked = formState.bookletLaminationRequired;
        if (formState.bookletLaminationType)
            document.getElementById('bookletLaminationType').value = formState.bookletLaminationType;
    } else if (formState.type === 'book') {
        if (formState.bookQuantity)
            document.getElementById('bookQuantity').value = formState.bookQuantity;
        if (formState.bookBodyColorType)
            document.getElementById('bookBodyColorType').value = formState.bookBodyColorType;
        if (formState.bookBodyFormat)
            document.getElementById('bookBodyFormat').value = formState.bookBodyFormat;
        if (formState.bookBodySheets)
            document.getElementById('bookBodySheets').value = formState.bookBodySheets;
        if (formState.bookBodyPaperType)
            document.getElementById('bookBodyPaperType').value = formState.bookBodyPaperType;
        if (formState.bookCoverNotRequired !== undefined)
            document.getElementById('bookCoverNotRequired').checked = formState.bookCoverNotRequired;
        if (formState.bookCoverColorType)
            document.getElementById('bookCoverColorType').value = formState.bookCoverColorType;
        if (formState.bookCoverPaperType)
            document.getElementById('bookCoverPaperType').value = formState.bookCoverPaperType;
        if (formState.bookCoverLaminationType)
            document.getElementById('bookCoverLaminationType').value = formState.bookCoverLaminationType;
        if (formState.bookBindingType)
            document.getElementById('bookBindingType').value = formState.bookBindingType;
    } else {
        if (formState.kras)
            document.getElementById('colorType').value = formState.kras;
        if (formState.item)
            document.getElementById('quantity').value = formState.item;
        if (formState.razmer)
            document.getElementById('formatType').value = formState.razmer;
        if (formState.pap)
            document.getElementById('paperType').value = formState.pap;
        if (formState.width)
            document.getElementById('width').value = formState.width;
        if (formState.height)
            document.getElementById('height').value = formState.height;
        if (formState.postprintRequired !== undefined)
            document.getElementById('postprintRequired').checked = formState.postprintRequired;
        const postprintOptions = ['embossing', 'dieCutting', 'lamination', 'scoring', 'folding', 'cornerRounding', 'numbering', 'perforation', 'gluing', 'binding'];
        postprintOptions.forEach(option => {
            if (formState[option + 'Required'] !== undefined)
                document.getElementById(option + 'Required').checked = formState[option + 'Required'];
            if (formState[option + (option === 'lamination' ? 'Type' : option === 'binding' ? 'Type' : 'Hits')]) {
                const fieldName = option + (option === 'lamination' ? 'Type' : option === 'binding' ? 'Type' : 'Hits');
                document.getElementById(fieldName).value = formState[fieldName];
            }
        });
        if (formState.bindingCount)
            document.getElementById('bindingCount').value = formState.bindingCount;
        if (formState.bindingWithCover !== undefined)
            document.getElementById('bindingWithCover').checked = formState.bindingWithCover;
        if (formState.stapleBindingCount)
            document.getElementById('stapleBindingCount').value = formState.stapleBindingCount;
    }
    setTimeout(() => { updateVisibility(); calculateCost(); }, 100);
}

function handleFormChange() { saveFormStateToStorage(); }
