// 每頁數量
const NUM_PER_PAGE = 10;
let snacksData = [];

function getData() {
  // loading
  const elLoading = document.querySelector('.loading');
  elLoading.classList.add('js-loading-active'); 

  const api = '../data/82156b65f0b623b09a59c7418f506965_export.json';
  fetch(api)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      elLoading.classList.remove('js-loading-active'); 
      snacksData = data;
      setPaginationTemplate(data.length);
      setSnacksTemplate(getPageData(1));
    })
    .catch(err => {
      console.log(err);
    })
}

// pagination 分頁邏輯
function setPaginationTemplate(len) {
  // el
  const elPaginationList = document.querySelector('.pagination__list');
  const elTotal = document.querySelector('.pagination__total');
  // 總頁數
  const totalPage = Math.round(len / NUM_PER_PAGE);

  // 總頁數 tempalte
  elTotal.textContent = totalPage;

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
  elPaginationList.innerHTML = tempalte;
}

// 小吃內容資料
function setSnacksTemplate(obj) {
  let template = '';
  let tableTemplate = '';
  obj.data.forEach((el, index) => {
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
            <h3 class="card__tit">
              ${nameTemplate}
            </h3>
            <div class="card__info">
              <p class="card__tag">${el.City}</p>
              <p class="card__area">${el.Town}</p>
            </div>
            <p class="card__desc">${el.HostWords}</p>
            <p class="card__address">${el.Address}</p>
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
        <td class="snacks__td text-right">${obj.min + index + 1}</td>
        <td class="snacks__td">${el.City}</td>
        <td class="snacks__td">${el.Town}</td>
        <td class="snacks__td snacks__name">${el.Name}</td>
        <td class="snacks__td snacks__address">${el.Address}</td>
      </tr>
    `;
  });
  document.querySelector('.snacks__list').innerHTML = template;
  document.querySelector('.snacks__tbody').innerHTML = tableTemplate;
}

// 鄉政區資料
function getAreaData(data) {
  let arr = [];
  data.forEach(item => {
    arr.push({
      city: item.City,
      town: item.Town,
    })
  })
  return arr;
}

function setFilterTemplate(data) {
  const filterArea = document.querySelector('#FilterArea');
  const filterTownship = document.querySelector('#FilterTownship');
  
  data.forEach(item => {
    
  })
}

// 換頁
function changePage(e) {
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
  if(!snacksData.length) {
    return;
  }

  let obj = {
    min: (page - 1) * NUM_PER_PAGE,
    data: [],
  }
  obj.max = obj.min + NUM_PER_PAGE - 1;

  for (let i = obj.min; i <= obj.max; i++) {
    if (!snacksData[i]) {
      obj.max = i;
      break;
    }
    obj.data.push(snacksData[i]);
  }

  return obj;
}

// mode 改變檢視模式
function changeMode(e) {
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
  document.querySelector('.mode__list').addEventListener('click', changeMode);
  // 分頁
  document.querySelector('.pagination__list').addEventListener('click', changePage);

}

init();
