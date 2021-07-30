## sass 資料夾結構
```css
/* --- base --- */
    /* Normalize */
    /* Reset */

/* --- layout --- */
    /* Header */
    /* Nav */
    /* Content */
    /* Siderbar */
    /* Footer */

/* --- views --- */
    /* pages */

/* --- components --- */
    /* 元件 */

/* --- utilities --- */
    /* Helper */
    /* State */
    /* Tools */

/* --- function --- */
    /* mixin */
    /* function */

/* --- vendors --- */
    /* Fontawesome */
    /* jQuery UI */
```

## 程式碼結構
```css
/* --- Global --- */
    /* Normalize */
    /* Reset */

/* --- Layouts --- */
    /* Header */
    /* Nav */
    /* Content */
    /* Siderbar */
    /* Footer */

/* --- Modules --- */
    /* Animation */
    /* Dropdown */
    /* Alert */
    /* Button */

/* --- Utilys --- */
    /* Helper */
    /* State */

/* --- Vendors --- */
    /* Fontawesome */
    /* jQuery UI */
```

## 屬性類型的順序：
相關的屬性聲明應當歸為一組，並按照下面的順序排列：
1. Positioning（定位）
2. Box model（區塊模型）
3. Typographic（排字）
4. Visual（視覺）
5. Other（其他）

```css
.store {
  /* Positioning */
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  display: block;
  float: right;
    
  /* Box-model */
  width: 100px;
  height: 100px;
  padding: 10px;
  margin: 10px;
    
  /* Typography */
  font: normal 13px "Helvetica Neue", sans-serif;
  line-height: 1.5;
  color: #333;
  text-align: center;
    
  /* Visual */
  background-color: #f5f5f5;
  border: 1px solid #e5e5e5;
  border-radius: 3px;
  box-shadow: 10px 0 5px rgba(0, 0, 0, .5);

  /* Other */
  opacity: 1;
  cursor: pointer;
  transition: width .3s ease
}
```

## 其他
**務必加上編碼**
```css
@charset "utf-8";
```

## 斷點
* pc 1360px
* 平板 768px
* 手機 414px