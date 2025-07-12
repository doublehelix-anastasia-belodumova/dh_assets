const signatureTemplateId = 'signature-template';
const signatureOutputId = 'signature-output';

const userNameId = 'userName';
const userTitleId = 'userTitle';
const emailId = 'email';
const phoneId = 'phone';
const photoUrlId = 'photoUrl';
const wordmarkId = 'wordmark';

const statusSuccess = 'SUCCESS';
const statusError = 'ERROR';
let copyStatus = '';

const wordmarkColor = 'https://raw.githubusercontent.com/doublehelix-anastasia-belodumova/dh_assets/main/wordmark-color-drk.png';
const wordmarkDark = 'https://raw.githubusercontent.com/doublehelix-anastasia-belodumova/dh_assets/main/wordmark.png';

function generateSignature() {
    const templateHTML = document.getElementById(signatureTemplateId).innerHTML;    

    const userName = getValueOrPlaceholder(userNameId)
    const userTitle = getValueOrPlaceholder(userTitleId)
    const email = getValueOrPlaceholder(emailId)
    const phone = getValueOrPlaceholder(phoneId);
    const photoUrl = document.getElementById(photoUrlId).value;
    
    const useGradientWordmark = document.getElementById(wordmarkId).checked;
    const wordmarkUrl = useGradientWordmark 
        ? wordmarkColor
        : wordmarkDark

    const signatureHTML = templateHTML
        .replace(/{USER_NAME}/g, userName)
        .replace(/{USER_TITLE}/g, userTitle)
        .replace(/{EMAIL}/g, email)
        .replace(/{PHONE}/g, phone)
        .replace(/{PHOTO_URL}/g, photoUrl)
        .replace(/{WORDMARK_URL}/g, wordmarkUrl);

    const outputElement = document.getElementById(signatureOutputId);
    if (outputElement) {
        outputElement.innerHTML = signatureHTML;
    } else {
        console.error('Output element not found!');
    }
}

function getValueOrPlaceholder(elementId) {
    return document.getElementById(elementId).value || document.getElementById(elementId).placeholder;
}

function copyRichText() {
    const signatureElement = document.getElementById('signature-output');
    
    if (navigator.clipboard && navigator.clipboard.write) {
        try {
            // get the HTML content with embedded styles
            const htmlContent = signatureElement.innerHTML;
            const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
            const clipboardItem = new ClipboardItem({
                'text/html': htmlBlob,
            });
            
            navigator.clipboard.write([clipboardItem]).then(() => {
                copyStatus = statusSuccess;
                handleCopy();
            }).catch(err => {
                console.error('Rich text copy failed:', err);
                copyStatus = statusError;
                handleCopy();
            });
        } catch (err) {
            console.error('Clipboard API failed:', err);
            copyStatus = statusError;
            handleCopy();
        }
    } else {
        console.error('Clipboard API not supported');
        copyStatus = statusError;
        handleCopy();
    }
}

function handleCopy() {
    const duration = 1000;
    const copyButton = document.querySelector('.copy-button');
    const copyButtonText = document.getElementById('copy-button-text');
    
    if (copyStatus === statusSuccess) {
        copyButton.classList.add('success');
        copyButtonText.textContent = 'Copied!';

    } else if (copyStatus === statusError) {
        copyButtonText.textContent = 'Failed!';
        
    }

    setTimeout(() => {
        copyButton.classList.remove('success');
        copyButtonText.textContent = 'Copy';
        copyStatus = '';
    }, duration);
}

window.addEventListener('load', function() {
    generateSignature();
});
