// 每頁數量
const NUM_PER_PAGE = 10;
const isMobile = window.innerWidth <= 414; 

// 原始資料
let snacksData = [];
// 篩選後資料
let filterSnacksData = [];
// 篩選關鍵字
const filterKeyword = {
  city: '',
  town: '',
};

// ajax 取得資料
function getData() {
  // loading
  const elLoading = document.querySelector('.loading');
  const body = document.body;
  elLoading.classList.add('js-loading-active');
  body.classList.add('js-no-scroll-bar');

  const api = '../data/82156b65f0b623b09a59c7418f506965_export.json';
  fetch(api)
    .then(res => res.json())
    .then(data => {
      // 關閉 loading
      elLoading.classList.remove('js-loading-active'); 
      body.classList.remove('js-no-scroll-bar');
      // 暫存資料
      snacksData = data;
      filterSnacksData = snacksData;
      // 製作分頁
      setPaginationTemplate(data.length);
      // 製作內容資料
      setSnacksTemplate(getPageData(1));
      // 製作縣市篩選選項
      setCityFilterTemplate(data);
    })
    .catch(err => {
      console.log(err);
    })
}

// 組 pagination 分頁 html
function setPaginationTemplate(len) {
  // 總頁數
  const totalPage = Math.ceil(len / NUM_PER_PAGE);

  if (!isMobile) {
    // 總頁數 tempalte
    document.querySelector('.pagination__total').textContent = totalPage;
    document.querySelector('.pagination__page').textContent = 1;
  }

  let tempalte = '';

  for (let i = 0; i < totalPage; i++) {
    let active = '';
    if(i === 0) {
      active = 'js-pagination__link--active';
    }

    tempalte += `
      <li class="pagination__item">
        <a class="pagination__link ${active}" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
      </li>
    `;
  }
  document.querySelector('.pagination__list').innerHTML = tempalte;
}

// 小吃內容資料
function setSnacksTemplate(snacksData) {
  let template = '';
  let tableTemplate = '';
  snacksData.data.forEach((el, index) => {
    let nameTemplate = el.Name;
    if(el.BlogUrl) {
      nameTemplate = `
        <a class="card__link" href="${el.BlogUrl}" target="_blank">${el.Name}</a>
      `;
    }
    template += `
      <li class="snacks__item">
        <div class="card">
          <div class="card__cntr">
            <h3 class="card__tit" title="${el.Name}">
              ${nameTemplate}
            </h3>
            <div class="card__info">
              <p class="card__tag">${el.City}</p>
              <p class="card__area">${el.Town}</p>
            </div>
            <p class="card__desc" title="${el.HostWords}">${el.HostWords}</p>
            <p class="card__address" title="${el.Address}">${el.Address}</p>
          </div>
          <figure class="card__pic">
            <img class="card__img" src="${el.PicURL}" alt="${el.Name}" width="" height="">
          </figure>
        </div>
      </li>
    `;
    let trStyle = '';
    if (index % 2) {
      trStyle = 'js-snacks__tr--even';
    }
    
    tableTemplate += `
      <tr class="snacks__tr ${trStyle}">
        <td class="snacks__td text-right">${snacksData.min + index + 1}</td>
        <td class="snacks__td" title="${el.City}">${el.City}</td>
        <td class="snacks__td" title="${el.Town}">${el.Town}</td>
        <td class="snacks__td snacks__name" title="${el.Name}">${el.Name}</td>
        <td class="snacks__td snacks__address" title="${el.Address}">${el.Address}</td>
      </tr>
    `;
  });
  document.querySelector('.snacks__list').innerHTML = template;
  document.querySelector('.snacks__tbody').innerHTML = tableTemplate;
}

// 縣市資料
function getAreaData(data) {
  const city = [];

  data.forEach(item => {
    if (!city.includes(item.City)) {
      city.push(item.City);
    }

  })

  return city;
}

// 鄉鎮區資料
function getTownData(city) {
  const town = [];
  snacksData.forEach(item => {
    if (!town.includes(item.Town) && item.City === city) {
      town.push(item.Town);
    }
  })
  return town;
}

// 加入縣市資料到畫面
function setCityFilterTemplate(data) {
  const filterArea = document.querySelector('#FilterArea');
  const city = getAreaData(data);
  filterTemplate(filterArea, city);
}

// 加入鄉鎮區資料到畫面
function setTownFilterTemplate(city) {
  const filterTownship = document.querySelector('#FilterTownship');
  const town = getTownData(city);
  filterTemplate(filterTownship, town);
}

// 組篩選 html
function filterTemplate(el, data) {
  let template = '<option class="filter__opt" value="" selected="true" disabled>請選擇行政區域...</option>';
  data.forEach(item => {
    template += `
      <option class="filter__opt" value="${item}">${item}</option>
    `
  })

  el.innerHTML = template;
}

// 篩選功能控制器
function changeFilterHandler(e) {
  if (!e.target.classList.contains('filter__select')) {
    return;
  }
  switch (e.target.id) {
    case 'FilterArea':
      filterKeyword.city = e.target.value;
      filterKeyword.town = '';
      setTownFilterTemplate(filterKeyword.city);
      break;
    case 'FilterTownship':
      filterKeyword.town = e.target.value;
      break;
  }
  filterData();
}

// 篩選功能
function filterData() {
  let arr = [];
  if (filterKeyword.city) {
    arr = snacksData.filter(item => item.City === filterKeyword.city)
  }

  if (filterKeyword.town) {
    arr = snacksData.filter(item => item.Town === filterKeyword.town)
  }
  filterSnacksData = arr;
  setPaginationTemplate(arr.length);
  setSnacksTemplate(getPageData(1));
}

// 換頁
function clcikPageHandler(e) {
  const targetClassList = e.target.classList;
  if (!targetClassList.contains('pagination__link') || targetClassList.contains('js-pagination__link--active')) {
    return;
  }
  const target = e.target;
  const elPage = document.querySelector('.pagination__page');
  const page = parseInt(target.dataset.page);

  document.querySelector('.js-pagination__link--active').classList.remove('js-pagination__link--active');
  target.classList.add('js-pagination__link--active');
  elPage.textContent = page;

  setSnacksTemplate(getPageData(page));
}

// 換頁取資料
function getPageData(page) {
  if(!filterSnacksData.length) {
    return;
  }

  let obj = {
    min: (page - 1) * NUM_PER_PAGE,
    data: [],
  }
  obj.max = obj.min + NUM_PER_PAGE - 1;

  for (let i = obj.min; i <= obj.max; i++) {
    if (!filterSnacksData[i]) {
      obj.max = i;
      break;
    }
    obj.data.push(filterSnacksData[i]);
  }

  return obj;
}

// mode 改變檢視模式
function clickModeHandler(e) {
  const target = e.target.parentElement;
  if (!target.classList.contains('mode__btn') || target.classList.contains('js-mode__btn--active')) {
    return;
  }
  // 前一個模式
  const prevMode = document.querySelector('.js-mode__btn--active');
  prevMode.classList.remove('js-mode__btn--active');
  target.classList.add('js-mode__btn--active');
  
  actionMode(prevMode.id, removeMode)
  actionMode(target.id, addMode)
}

// 檢視模式動作執行
function actionMode(id, action) {
  const snacks = document.querySelector('.snacks');
  action(snacks, id);
}

function removeMode(el, id) {
  switch (id) {
    case 'List': 
      el.classList.remove('snacks-list');
      break;
    case 'Table': 
      el.classList.remove('snacks-table');
      break;
    case 'Card': 
      el.classList.remove('snacks-card');
      break;
  }
}

function addMode(el, id) {
  switch (id) {
    case 'List': 
      el.classList.add('snacks-list');
      break;
    case 'Table': 
      el.classList.add('snacks-table');
      break;
    case 'Card': 
      el.classList.add('snacks-card');
      break;
  }
}

function init() {
  getData();

  // click
  // 檢視模式
  document.querySelector('.mode__list').addEventListener('click', clickModeHandler);
  // 分頁
  document.querySelector('.pagination__list').addEventListener('click', clcikPageHandler);

  // change 
  // 篩選
  document.querySelector('.filter').addEventListener('change', changeFilterHandler)

}

init();
