
// =============================================
// ФУНКЦИИ РАБОТЫ С ИЗДЕЛИЯМИ
// =============================================
function addProduct() {
    const product = getFormData();
    if (isDuplicateProduct(product)) { showDuplicateModal(product); return; }
    saveProduct(product);
}
function saveProduct(product) {
    if (currentProductId) {
        const index = products.findIndex(p => p.id === currentProductId);
        if (index !== -1) products[index] = product;
    } else {
        products.push(product);
        const productType = product.type;
        productCounter[productType] = (productCounter[productType] || 1) + 1;
        saveProductCounterToStorage();
    }
    saveProductsToStorage();
    resetForm();
    renderProductsList();
    const totalCost = updateTotalCost();
    showNotification(`${totalCost.toFixed(2)} руб.`, true);
}
function editProduct(index) {
    if (index >= 0 && index < products.length) {
        const product = products[index];
        fillForm(product);
        document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
    }
}
function deleteProduct(index) {
    if (index >= 0 && index < products.length) {
        products.splice(index, 1);
        saveProductsToStorage();
        renderProductsList();
        const totalCost = updateTotalCost();
        showNotification(`${totalCost.toFixed(2)} руб.`, true);
    }
}
function renderProductsList() {
    const productsList = document.getElementById('productsList');
    if (!productsList) return;
    if (products.length === 0) {
        productsList.innerHTML = '<div class="empty-list-message">Добавьте первое изделие</div>';
        return;
    }
    productsList.innerHTML = '';
    products.forEach((product, index) => {
        const costResult = calculateProductCost(product);
        const totalCost = costResult.totalCost < MINIMAL_ORDER_COST ? MINIMAL_ORDER_COST : costResult.totalCost;
        const productElement = document.createElement('div');
        productElement.className = 'product-item';
        if (product.type === 'book') {
            productElement.innerHTML = `
                <div class="product-summary">
                    <div class="product-info">
                        <div class="product-name">${product.name} <span class="product-type-badge">${getProductTypeName(product.type)}</span></div>
                        <div class="product-basic-details">${getProductDetails(product)}</div>
                    </div>
                    <div class="product-cost">${totalCost.toFixed(2)} руб.</div>
                    <div class="product-actions">
                        <button class="action-btn edit-btn edit-button" data-index="${index}">
                            <svg class="edit-svgIcon" viewBox="0 0 512 512"><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path></svg>
                        </button>
                        <button class="action-btn delete-btn button" data-index="${index}">
                            <svg class="svgIcon" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg>
                        </button>
                    </div>
                </div>
                <div class="product-details">
                    ${costResult.bodyCost > 0 ? `<div class="detail-row"><span class="detail-label">Блок книги:</span><span class="detail-value">${costResult.bodyCost.toFixed(2)} руб.</span></div>` : ''}
                    ${costResult.coverCost > 0 ? 
                        `<div class="detail-row"><span class="detail-label">Обложка:</span><span class="detail-value">${costResult.coverCost.toFixed(2)} руб.</span></div>` : 
                        (product.bookCoverNotRequired ? 
                            `<div class="detail-row"><span class="detail-label">Обложка:</span><span class="detail-value">нет</span></div>` : 
                            '')
                    }
                    ${costResult.bindingCost > 0 ? `<div class="detail-row"><span class="detail-label">Переплет книги:</span><span class="detail-value">${costResult.bindingCost.toFixed(2)} руб.</span></div>` : ''}
                </div>
            `;
        } else {
            productElement.innerHTML = `
                <div class="product-summary">
                    <div class="product-info">
                        <div class="product-name">${product.name} <span class="product-type-badge">${getProductTypeName(product.type)}</span></div>
                        <div class="product-basic-details">${getProductDetails(product)}</div>
                    </div>
                    <div class="product-cost">${totalCost.toFixed(2)} руб.</div>
                    <div class="product-actions">
                        <button class="action-btn edit-btn edit-button" data-index="${index}">
                            <svg class="edit-svgIcon" viewBox="0 0 512 512"><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path></svg>
                        </button>
                        <button class="action-btn delete-btn button" data-index="${index}">
                            <svg class="svgIcon" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg>
                        </button>
                    </div>
                </div>
                <div class="product-details">
                    <div class="detail-row"><span class="detail-label">Печать:</span><span class="detail-value">${costResult.costPrintOnly.toFixed(2)} руб.</span></div>
                    <div class="detail-row"><span class="detail-label">Бумага:</span><span class="detail-value">${costResult.costPaperOnly.toFixed(2)} руб.</span></div>
                    <div class="detail-row"><span class="detail-label">Резка:</span><span class="detail-value">${costResult.itemRez.toFixed(2)} руб.</span></div>
                    ${costResult.bookletScoringCost > 0 ? `<div class="detail-row"><span class="detail-label">Биговка лифлетов:</span><span class="detail-value">${costResult.bookletScoringCost.toFixed(2)} руб.</span></div>` : ''}
                    ${costResult.embossingCost > 0 ? `<div class="detail-row"><span class="detail-label">Тиснение:</span><span class="detail-value">${costResult.embossingCost.toFixed(2)} руб.</span></div>` : ''}
                    ${costResult.dieCuttingCost > 0 ? `<div class="detail-row"><span class="detail-label">Вырубка:</span><span class="detail-value">${costResult.dieCuttingCost.toFixed(2)} руб.</span></div>` : ''}
                    ${costResult.laminationCost > 0 ? `<div class="detail-row"><span class="detail-label">Ламинация:</span><span class="detail-value">${costResult.laminationCost.toFixed(2)} руб.</span></div>` : ''}
                    ${costResult.scoringCost > 0 ? `<div class="detail-row"><span class="detail-label">Биговка:</span><span class="detail-value">${costResult.scoringCost.toFixed(2)} руб.</span></div>` : ''}
                    ${costResult.foldingCost > 0 ? `<div class="detail-row"><span class="detail-label">Фальцовка:</span><span class="detail-value">${costResult.foldingCost.toFixed(2)} руб.</span></div>` : ''}
                    ${costResult.cornerRoundingCost > 0 ? `<div class="detail-row"><span class="detail-label">Скругление углов:</span><span class="detail-value">${costResult.cornerRoundingCost.toFixed(2)} руб.</span></div>` : ''}
                    ${costResult.numberingCost > 0 ? `<div class="detail-row"><span class="detail-label">Нумерация:</span><span class="detail-value">${costResult.numberingCost.toFixed(2)} руб.</span></div>` : ''}
                    ${costResult.perforationCost > 0 ? `<div class="detail-row"><span class="detail-label">Перфорация:</span><span class="detail-value">${costResult.perforationCost.toFixed(2)} руб.</span></div>` : ''}
                    ${costResult.gluingCost > 0 ? `<div class="detail-row"><span class="detail-label">Склейка:</span><span class="detail-value">${costResult.gluingCost.toFixed(2)} руб.</span></div>` : ''}
                    ${costResult.bindingCost > 0 ? `<div class="detail-row"><span class="detail-label">Переплет:</span><span class="detail-value">${costResult.bindingCost.toFixed(2)} руб.</span></div>` : ''}
                </div>
            `;
        }
        const editBtn = productElement.querySelector('.edit-btn');
        const deleteBtn = productElement.querySelector('.delete-btn');
        editBtn.addEventListener('click', (e) => { e.stopPropagation(); editProduct(index); });
        deleteBtn.addEventListener('click', (e) => { e.stopPropagation(); deleteProduct(index); });
        productsList.appendChild(productElement);
    });
}
function getProductDetails(product) {
    let details = '';
    switch (product.type) {
        case 'visiting': details = `Визитки, ${product.item} шт., ${getColorTypeName(product.kras)}, ${getPaperName(product.pap)}`; break;
        case 'booklet': details = `Лифлеты ${product.bookletSize}, ${product.item} шт., ${getColorTypeName(product.kras)}, ${getPaperName(product.pap)}`; break;
        case 'book': 
            const coverInfo = product.bookCoverNotRequired ? 'без обложки' : 'с обложкой';
            details = `Книга, тираж ${product.bookQuantity} шт., ${getFormatName(product.bookBodyFormat)}, ${product.bookBodySheets} л., ${getColorTypeName(product.bookBodyColorType)}, ${coverInfo}`; 
            break;
        default: details = `${getFormatName(product.razmer)}, ${product.item} шт., ${getColorTypeName(product.kras)}, ${getPaperName(product.pap)}`;
    }
    return details;
}
function isDuplicateProduct(newProduct) {
    return products.some(product => 
        product.type === newProduct.type &&
        product.kras === newProduct.kras &&
        product.item === newProduct.item &&
        product.razmer === newProduct.razmer &&
        product.pap === newProduct.pap &&
        (product.type !== 'booklet' || product.bookletSize === newProduct.bookletSize) &&
        (product.type !== 'book' || (
            product.bookQuantity === newProduct.bookQuantity &&
            product.bookBodyColorType === newProduct.bookBodyColorType &&
            product.bookBodyFormat === newProduct.bookBodyFormat &&
            product.bookBodySheets === newProduct.bookBodySheets &&
            product.bookBodyPaperType === newProduct.bookBodyPaperType &&
            product.bookCoverNotRequired === newProduct.bookCoverNotRequired &&
            product.bookCoverColorType === newProduct.bookCoverColorType &&
            product.bookCoverPaperType === newProduct.bookCoverPaperType &&
            product.bookCoverLaminationType === newProduct.bookCoverLaminationType &&
            product.bookBindingType === newProduct.bookBindingType
        ))
    );
}