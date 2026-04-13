const keyData = {
    '1': {
        title: 'Google Gemini',
        desc: '브라우저를 열고 gemini.google.com으로 바로 이동합니다. 아이디어 창출, 글쓰기, 코딩을 즉시 시작하세요.',
        warning: '한글 입력 상태에서는 작동하지 않을 수 있습니다. 키 매핑 소프트웨어를 통해 최적화해 보세요.',
        icon: 'Gemini 로고',
        isGemini: true
    },
    '2': {
        title: '전체 선택',
        desc: '현재 활성화된 창의 모든 텍스트나 항목을 한 번에 선택합니다 (Ctrl/Cmd + A).',
        icon: '2'
    },
    '3': {
        title: '복사',
        desc: '선택한 텍스트나 항목을 클립보드에 복사합니다 (Ctrl/Cmd + C).',
        icon: '3'
    },
    '4': {
        title: '잘라내기',
        desc: '선택한 텍스트나 항목을 클립보드에 잘라냅니다 (Ctrl/Cmd + X).',
        icon: '4'
    },
    '5': {
        title: '붙여넣기',
        desc: '클립보드에 복사해 둔 내용을 현재 커서 위치에 붙여넣습니다 (Ctrl/Cmd + V).',
        icon: '5'
    },
    '6': {
        title: '실행 취소',
        desc: '방금 한 작업을 취소하고 이전 상태로 되돌립니다 (Ctrl/Cmd + Z).',
        icon: '6'
    },
    '7': {
        title: '화면 캡처',
        desc: '현재 화면을 빠르게 캡처하여 저장하거나 공유합니다.',
        icon: '7'
    },
    '8': {
        title: '새 탭 열기',
        desc: '웹 브라우저에서 새로운 탭을 엽니다 (Ctrl/Cmd + T).',
        icon: '8'
    },
    'knob': {
        title: '모드 전환 및 볼륨 조절',
        desc: '노브를 누르면 Windows와 Mac 호환 모드가 전환됩니다. 노브를 좌우로 돌리면 시스템 볼륨을 조절할 수 있습니다.',
        icon: 'Red Knob'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const keys = document.querySelectorAll('.key, .knob');
    const titleEl = document.getElementById('keyTitle');
    const descEl = document.getElementById('keyDesc');
    const geminiLink = document.getElementById('geminiLink');
    const keyWarning = document.getElementById('keyWarning');
    const keySound = new Audio('key.mp3');

    const updateInfoPanel = (dataKey) => {
        const data = keyData[dataKey];
        if (!data) return;

        titleEl.textContent = data.title;
        descEl.innerHTML = data.desc;
        
        if (data.isGemini) {
            geminiLink.style.display = 'inline-block';
        } else {
            geminiLink.style.display = 'none';
        }

        if (data.warning) {
            keyWarning.textContent = data.warning;
            keyWarning.classList.remove('hidden');
        } else {
            keyWarning.classList.add('hidden');
        }
    };

    keys.forEach(key => {
        const dataKey = key.getAttribute('data-key');
        
        key.addEventListener('mouseenter', () => {
            updateInfoPanel(dataKey);
        });

        key.addEventListener('click', () => {
            keySound.currentTime = 0;
            keySound.play().catch(e => console.warn('Audio play failed:', e));

            updateInfoPanel(dataKey);
            
            key.classList.add('active');
            setTimeout(() => {
                key.classList.remove('active');
            }, 100);

            if (dataKey === '1') {
                window.open('https://gemini.google.com', '_blank');
            }
        });
    });

    // --- LED Control Logic ---
    let ledIsOn = false;
    let currentEffectIndex = 1;
    const totalEffects = 3;
    const effectNames = ["오로라 (Rainbow)", "숨쉬기 (Breathing)", "고정광 (Static)"];

    const powerToggle = document.getElementById('powerToggle');
    const changeBtn = document.getElementById('changeBtn');
    const ledZone = document.getElementById('ledZone');
    const ledStatus = document.getElementById('ledStatus');

    function updateLEDStatus() {
        if (!ledIsOn) {
            ledStatus.textContent = '꺼짐 (Off)';
            ledStatus.style.color = 'var(--text-secondary)';
            ledZone.classList.remove('led-on', 'effect-1', 'effect-2', 'effect-3');
        } else {
            ledStatus.textContent = effectNames[currentEffectIndex - 1];
            ledStatus.style.color = 'var(--primary-color)';
            ledZone.classList.add('led-on');
            ledZone.classList.remove('effect-1', 'effect-2', 'effect-3');
            ledZone.classList.add(`effect-${currentEffectIndex}`);
        }
    }

    if (powerToggle && changeBtn) {
        powerToggle.addEventListener('change', (e) => {
            ledIsOn = e.target.checked;
            updateLEDStatus();
        });

        changeBtn.addEventListener('click', () => {
            if (!ledIsOn) {
                // Turn on automatically if not on
                ledIsOn = true;
                powerToggle.checked = true;
            } else {
                currentEffectIndex++;
                if (currentEffectIndex > totalEffects) {
                    currentEffectIndex = 1;
                }
            }
            updateLEDStatus();
            
            // Visual feedback
            changeBtn.style.transform = 'translateY(1px)';
            changeBtn.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.1)';
            setTimeout(() => {
                changeBtn.style.transform = '';
                changeBtn.style.boxShadow = '';
            }, 150);
        });
    }
});
