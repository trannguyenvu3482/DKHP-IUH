const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// variables
const navTabs = $('.navigation-tabs');
const getClassListBtn = $('.laydslhp-submit-btn');
const submitLHPBtn = $('.dkn-submit-btn');
const resultContent = $('.section__result__table');
const resultTextBox = $('.section__result__loop');
const sectionDKNResultTextBox = $('.section-DKN__result__box');
const resultClasses = [];

// Tab switching handler
const toggleActiveTabs = (e) => {
  const classes = e.target.classList;
  $('.nav-link.navigation-link.active').classList.remove('active');
  classes.add('active');

  $('.section.main-section.active').classList.remove('active');
  $(
    `.section.main-section.section-${e.target.closest('.nav-item').dataset.id}`
  ).classList.add('active');
};

navTabs.addEventListener('click', (e) => {
  toggleActiveTabs(e);
});

// Register button handler
document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    let url = tabs[0].url;

    if (url && url.includes('dkhp.iuh.edu.vn')) {
      console.log('This is the right page');
    } else {
      $('.main').innerHTML = `
         <span style="font-size: 28px; font-weight: bold"> Hãy dùng extension này tại <a href="http://dkhp.iuh.edu.vn">dkhp.iuh.edu.vn</a>!</span>
      `;
    }
  });

  // Reset localStorage
  localStorage.setItem('result', '');

  // Get class list button handler
  getClassListBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    let inputObject = {
      maMonHoc: $('.section-LDSLHP__maMonHoc__input').value,
      idDot: $('.section-LDSLHP__idDot__input').value,
      DSHP: $('.section-LDSLHP__DSHP__input').value,
    };

    console.log(inputObject);

    const fetchData = async () => {
      try {
        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

        let urlencoded = new URLSearchParams();
        urlencoded.append('maMonHoc', inputObject.maMonHoc);
        urlencoded.append('idDot', inputObject.idDot);
        urlencoded.append('dsHocPhanDuocHoc', inputObject.DSHP);
        urlencoded.append('khoaHocDangKy', '0');
        urlencoded.append('isLHPKhongTrungLich', 'true');

        let requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: urlencoded,
          redirect: 'follow',
        };

        const url =
          'https://dkhp.iuh.edu.vn/DangKyHocPhan/GetDanhSachLopHocPhan';

        const response = await fetch(url, requestOptions);
        const data = await response.json();

        // Save result to localstorage
        if (data) {
          localStorage.setItem('result', JSON.stringify(data));
        }
      } catch (error) {
        resultTextBox.textContent =
          'Lỗi khi lấy dữ liệu, vui lòng kiểm tra các trường đã nhập!';
      }
    };

    const renderData = async () => {
      console.log('RENDERING!');
      // Get result from localstorage and turn into JSON
      const result = localStorage.getItem('result');
      const resultData = JSON.parse(result);

      if (!resultData) return;

      // Render result
      let resultHTML = ``;

      // Render each item in resultJSON to table
      resultData.forEach((item) => {
        console.log('RENDER DATA!');
        let resultJSONHtml = `
        <tr>
          <td style="padding-left: 10px;">${item.IdLopHocPhanString}</td>
          <td>${item.LopDuKien}</td>
          <td style="padding-right: 10px;">${item.SiSoDangKy} / ${item.SiSoToiDa}
          </td>
          </tr>`;
        if (resultJSONHtml !== undefined) {
          resultHTML += resultJSONHtml;
        }
      });

      console.log(resultHTML);
      resultContent.insertAdjacentHTML('beforeend', resultHTML);
    };

    const mainFunc = async () => {
      await fetchData();
      await renderData();
    };

    mainFunc();
  });

  // Xem chi tiet LHP

  // Dang ki hoc phan
  submitLHPBtn.addEventListener('click', async (e) => {
    let fetchSuccess = false;
    e.preventDefault();

    let inputObject = {
      idLopHocPhan: $('.section-DKN__idLopHoc__input').value,
      loaiDangky: $('.section-DKN__loaiDangKy__input').value,
      idDot: $('.section-DKN__idDot__input').value,
      nhomThucHanh: $('.section-DKN__nhomThucHanh__input').value,
    };

    console.log(inputObject);

    const fetchData = async () => {
      try {
        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

        let urlencoded = new URLSearchParams();
        urlencoded.append('idLopHocPhan', inputObject.idLopHocPhan);
        urlencoded.append('loaiDangky', inputObject.loaiDangky);
        urlencoded.append('idDot', inputObject.idDot);
        urlencoded.append('nhomThucHanh', inputObject.nhomThucHanh);

        let requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: urlencoded,
          redirect: 'follow',
        };

        const url = 'https://dkhp.iuh.edu.vn/DangKyHocPhan/DangKyHocPhan';

        const response = await fetch(url, requestOptions);
        const data = await response.json();
        if (data) {
          fetchSuccess = true;
          console.log('Đăng kí thành công');
        }
      } catch (error) {
        resultTextBox.textContent =
          'Lỗi khi lấy dữ liệu, vui lòng kiểm tra các trường đã nhập!';
      }
    };

    const mainFunc = async () => {
      await fetchData();
      if (fetchSuccess) {
        sectionDKNResultTextBox.textContent = 'Đăng kí thành công!';
      } else {
        sectionDKNResultTextBox.textContent =
          'Đăng kí không thành công, vui lòng kiểm tra lại các trường đã nhập!';
      }
    };

    mainFunc();
  });
});
