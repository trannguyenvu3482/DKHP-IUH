const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Global variables
const navTabs = $('.navigation-tabs');
const getClassListBtn = $('.laydslhp-submit-btn');
const getClassInfoBtn = $('.xemChiTiet-submit-btn');
const getClassClearTableBtn = $('.laydslhp-clear-btn');
const xemChiTietClearTableBtn = $('.xemChiTiet-clear-btn');
const submitLHPBtn = $('.dkn-submit-btn');
const resultContent = $('.section__result__table');
const xemChitietTable = $('.section__result__xemChiTiet__table');
const resultTextBox = $('.section__result__loop');
const sectionDKNResultTextBox = $('.section-DKN__result__box');
const xemChiTietCurrentId = $('.section__result__idHienTai');
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
  // Check if the url is correct and user is login
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    let url = tabs[0].url.toLowerCase();

    if (url && url.includes('dkhp.iuh.edu.vn')) {
      if (url.includes('login')) {
        $('.main').innerHTML = `
         <span style="font-size: 28px; font-weight: bold"> Hãy đăng nhập vào tài khoản sinh viên của bạn trước khi sử dụng Extension!</span>
      `;
      }
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
      // Get result from localstorage and turn into JSON
      const result = localStorage.getItem('result');
      const resultData = JSON.parse(result);

      if (!resultData) return;

      // Render result
      let resultHTML = ``;

      // Render each item in resultJSON to table
      resultData.forEach((item) => {
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

      resultContent.insertAdjacentHTML('beforeend', resultHTML);
    };

    const mainFunc = async () => {
      await fetchData();
      await renderData();
    };

    mainFunc();
  });

  // Handle delete getClassList table btn
  getClassClearTableBtn.addEventListener('click', () => {
    resultContent.innerHTML = `
      <tr style="background-color: #50a9f2">
        <th style="padding-left: 10px">ID</th>
        <th>Lớp dự kiến</th>
        <th style="padding-right: 10px">Tình trạng hiện tại</th>
      </tr>
    `;
  });

  // Xem chi tiet LHP
  getClassInfoBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    let inputObject = {
      idLopHocPhan: $('.section-xemChiTiet__idLopHoc__input').value,
    };

    const fetchData = async () => {
      try {
        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

        let urlencoded = new URLSearchParams();
        urlencoded.append('idLopHocPhan', inputObject.idLopHocPhan.trim());
        urlencoded.append('maNhomTH', -1);

        let requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: urlencoded,
          redirect: 'follow',
        };

        const url =
          'https://dkhp.iuh.edu.vn/DangKyHocPhan/GetChiTietLopHocPhan';

        const response = await fetch(url, requestOptions);
        const data = await response.json();
        if (data) {
          localStorage.setItem('result', JSON.stringify(data));
        }
      } catch (error) {
        $('.section__result__xemChiTiet__loop').textContent =
          'Lỗi khi lấy dữ liệu, vui lòng kiểm tra các trường đã nhập!';
      }
    };

    const renderData = async () => {
      // Get result from localstorage and turn into JSON
      const result = localStorage.getItem('result');
      const resData = JSON.parse(result);
      const resultData = resData.ListLichHoc;

      // Nếu không có ID thì thoát hàm
      if (!resultData) return;

      // Set ID hiện tại
      xemChiTietCurrentId.textContent = $(
        '.section-xemChiTiet__idLopHoc__input'
      ).value;

      // Render result
      let resultHTML = ``;

      // Render each item to table
      resultData.forEach((item) => {
        let resultJSONHtml = `
        <tr>
          <td style="padding-left: 10px;">${item.LichHoc}</td>
          <td>${item.Phong}</td>
          <td>${item.GiangVien}</td>
          <td style="padding-right: 10px;">${item.NhomThucHanh || ''}</td>
          </tr>`;
        if (resultJSONHtml !== undefined) {
          resultHTML += resultJSONHtml;
        }
      });

      xemChitietTable.insertAdjacentHTML('beforeend', resultHTML);
    };

    // Main function, use async-await to wait for fetching to be done
    const mainFunc = async () => {
      await fetchData();
      await renderData();
    };

    mainFunc();
  });

  // Handle delete xemChiTiet table btn
  xemChiTietClearTableBtn.addEventListener('click', () => {
    xemChitietTable.innerHTML = `
    <tr style="background-color: #50a9f2">
      <th style="padding-left: 10px">Lịch học</th>
      <th>Phòng</th>
      <th>Giảng viên</th>
      <th style="padding-right: 10px">Nhóm TH</th>
    </tr>
    `;
  });

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
