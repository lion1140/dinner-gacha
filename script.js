const defaultMenus = [
    { name: "肉じゃが定食", category: "japanese", memo: "※豚肉がなければ牛肉や鶏肉でもOK！" },
    { name: "鮭の塩焼きと小鉢", category: "japanese", memo: "※魚がなければツナ缶や厚揚げでも代用できます" },
    { name: "とろ〜り親子丼", category: "japanese", memo: "※鶏モモ肉の代わりに鶏胸肉や豚肉でも美味しいです" },
    { name: "ふんわりオムライス", category: "western", memo: "※ケチャップがなければウスターソースとケチャップを混ぜて代用！" },
    { name: "トマトクリームパスタ", category: "western", memo: "※生クリームの代わりに牛乳＋バターで濃厚に仕上がります" },
    { name: "マカロニグラタン", category: "western", memo: "※マカロニがなければ食パンをちぎって即席ドリア風に！" },
    { name: "鶏のから揚げ", category: "meat", memo: "※ニンニク・生姜チューブだけでも美味しく漬かります" },
    { name: "ジューシーハンバーグ", category: "meat", memo: "※パン粉がなければ食パンを細かくちぎって代用OK" },
    { name: "豚の生姜焼き", category: "meat", memo: "※生姜チューブでOK！玉ねぎをプラスするとボリュームUP" },
    { name: "おうちカレーライス", category: "meat", memo: "※お肉がなくても、ツナ缶やちくわを入れると旨味が出ます！" },
    { name: "パリッと焼き餃子", category: "chinese", memo: "※キャベツの代わりに白菜や千切りキャベツ（カット野菜）でも可" },
    { name: "ピリ辛麻婆豆腐", category: "chinese", memo: "※ひき肉がなければツナ缶や豚こま肉を刻んで代用できます" }
];

let menus = JSON.parse(localStorage.getItem('dinner_menus')) || defaultMenus;

const gachaBtn = document.getElementById('gacha-btn');
const resultText = document.getElementById('result-text');
const memoText = document.getElementById('memo-text');
const filterBtns = document.querySelectorAll('.filter-btn');
const twitterShareBtn = document.getElementById('twitter-share');
const lineShareBtn = document.getElementById('line-share');

// 開閉ボタンと管理パネルの要素
const toggleListBtn = document.getElementById('toggle-list-btn');
const adminPanel = document.getElementById('admin-panel');

const newNameInput = document.getElementById('new-name');
const newCategorySelect = document.getElementById('new-category');
const newMemoInput = document.getElementById('new-memo');
const addBtn = document.getElementById('add-btn');
const menuListUl = document.getElementById('menu-list');

// 編集モーダル関連
const editModal = document.getElementById('edit-modal');
const editNameInput = document.getElementById('edit-name');
const editCategorySelect = document.getElementById('edit-category');
const editMemoInput = document.getElementById('edit-memo');
const saveEditBtn = document.getElementById('save-edit-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

let currentCategory = 'all';
let editingIndex = null;

// リスト開閉ボタンの処理
toggleListBtn.addEventListener('click', function() {
    if (adminPanel.style.display === 'none') {
        adminPanel.style.display = 'block';
        toggleListBtn.textContent = '📋 メニューの追加・編集・削除を閉じる';
        renderMenuList(); // 開いたときに最新リストを描画
    } else {
        adminPanel.style.display = 'none';
        toggleListBtn.textContent = '📋 メニューの追加・編集・削除を開く';
    }
});

// メニュー一覧を画面に描画する関数
function renderMenuList() {
    menuListUl.innerHTML = '';
    
    menus.forEach((menu, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span><strong>${menu.name}</strong> <small>(${getCategoryName(menu.category)})</small></span>
            <div class="item-buttons">
                <button class="edit-action-btn" onclick="openEditModal(${index})">編集</button>
                <button class="delete-action-btn" onclick="deleteMenu(${index})">削除</button>
            </div>
        `;
        menuListUl.appendChild(li);
    });
}

function getCategoryName(cat) {
    if (cat === 'japanese') return '和食';
    if (cat === 'western') return '洋食';
    if (cat === 'meat') return 'お肉';
    if (cat === 'chinese') return '中華';
    return '';
}

function saveAndRefresh() {
    localStorage.setItem('dinner_menus', JSON.stringify(menus));
    renderMenuList();
}

// メニュー追加ボタン
addBtn.addEventListener('click', function() {
    const name = newNameInput.value.trim();
    const category = newCategorySelect.value;
    const memo = newMemoInput.value.trim();

    if (name === "") {
        alert("メニュー名を入力してください！");
        return;
    }

    menus.push({ name: name, category: category, memo: memo });
    saveAndRefresh();

    newNameInput.value = "";
    newMemoInput.value = "";
    alert(`「${name}」を追加しました！`);
});

// メニュー削除機能
window.deleteMenu = function(index) {
    if (confirm(`「${menus[index].name}」を削除しますか？`)) {
        menus.splice(index, 1);
        saveAndRefresh();
    }
};

// 編集モーダルを開く
window.openEditModal = function(index) {
    editingIndex = index;
    const target = menus[index];
    editNameInput.value = target.name;
    editCategorySelect.value = target.category;
    editMemoInput.value = target.memo;
    
    editModal.style.display = 'flex';
};

// 編集を保存
saveEditBtn.addEventListener('click', function() {
    const name = editNameInput.value.trim();
    if (name === "") {
        alert("メニュー名を入力してください！");
        return;
    }

    menus[editingIndex] = {
        name: name,
        category: editCategorySelect.value,
        memo: editMemoInput.value.trim()
    };

    saveAndRefresh();
    editModal.style.display = 'none';
});

// 編集キャンセル
cancelEditBtn.addEventListener('click', function() {
    editModal.style.display = 'none';
});

// ジャンルボタン切り替え
filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentCategory = this.getAttribute('data-category');
    });
});

// ガチャを回す処理
gachaBtn.addEventListener('click', function() {
    let targetMenus = menus;
    if (currentCategory !== 'all') {
        targetMenus = menus.filter(menu => menu.category === currentCategory);
    }

    if (targetMenus.length === 0) {
        resultText.textContent = "該当するメニューがありません";
        memoText.textContent = "別のジャンルを選ぶか、メニューを追加してください";
        return;
    }

    gachaBtn.disabled = true;

    let count = 0;
    const maxCount = 15;
    const intervalTime = 70;

    const rouletteTimer = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * targetMenus.length);
        resultText.textContent = targetMenus[randomIndex].name;
        memoText.textContent = "材料をチェック中……";
        
        count++;
        
        if (count >= maxCount) {
            clearInterval(rouletteTimer);
            
            const finalIndex = Math.floor(Math.random() * targetMenus.length);
            const selectedMenu = targetMenus[finalIndex];
            
            resultText.textContent = selectedMenu.name;
            memoText.textContent = selectedMenu.memo;
            
            updateShareLinks(selectedMenu.name, selectedMenu.memo);

            gachaBtn.disabled = false;
        }
    }, intervalTime);
});

// SNSシェア用リンク更新
function updateShareLinks(menuName, memo) {
    const shareText = `今日の夜ご飯は【${menuName}】に決まりました！\n（${memo}）\n#夜ご飯ガチャ`;
    
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    twitterShareBtn.setAttribute('href', twitterUrl);

    const lineUrl = `https://social-plugins.line.me/lineit/share?text=${encodeURIComponent(shareText)}`;
    lineShareBtn.setAttribute('href', lineUrl);
}