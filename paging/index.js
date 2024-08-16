const key = '704e464e4873656f33314c56786274'
let start = 1
let end = 200
const url = `http://openapi.seoul.go.kr:8088/${key}/json/HmvlnCnsltInfo/${start}/${end}/`;

let itemsPerPage = 6; // 한 페이지에 표시될 항목 수
let currentPage = 1;
let searchData = []
let show_searchData = []

const totalRows = document.getElementById('totalRows');
const pagination = document.getElementById('pagination');
const searchInput = document.getElementById('searchInput');
const selectElement = document.getElementById("district");
const searchButton = document.getElementById('searchButton')
const prevButton = document.getElementById('prevPage');
const nextButton = document.getElementById('nextPage');


fetch(url)
    .then(response => response.json())
    .then(data => {
        searchData = data.HmvlnCnsltInfo.row; // 전체 데이터 저장
        updateTable(searchData.slice(0, itemsPerPage)); // 초기 데이터로 테이블 업데이트
        return searchData.length
    })
    .then(data => {
        totalRows.textContent = `총 ${data}개의 데이터`;
        renderPagination(data); // 페이지네이션 렌더링
    })
    .catch(error => {
        console.log(error);
    });

// 검색창에서 Enter 키 입력 시 검색 버튼 클릭 이벤트 발생
searchInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') { // Enter 키를 눌렀을 때
        event.preventDefault(); // 기본 동작(폼 제출) 방지
        document.getElementById('searchButton').click(); // 검색 버튼 클릭
    }
});

// addEventListener를 사용하여 change 이벤트를 처리합니다.
selectElement.addEventListener("change", function () {
    itemsPerPage = selectElement.value
});

// 검색 버튼 클릭 시 이벤트 처리
searchButton.addEventListener('click', () => {
    const searchInput_value = searchInput.value.trim().toLowerCase(); // 검색어 입력란 값
    show_searchData = searchData.filter(item => {
        // 각 항목에서 검색어가 포함되어 있는지 확인
        return (
            item.KIND_NM.toLowerCase().includes(searchInput_value) ||
            item.NM.toLowerCase().includes(searchInput_value) ||
            item.ADDR_OLD.toLowerCase().includes(searchInput_value) ||
            item.STATE.toLowerCase().includes(searchInput_value) ||
            item.TEL.toLowerCase().includes(searchInput_value)
        );
    });
    currentPage = 1
    updateTable(show_searchData.slice(0, itemsPerPage)); // 필터링된 데이터로 테이블 업데이트
    renderPagination(show_searchData.length)
});





/* ----------------함수 모음-------------------- */
// 테이블 업데이트 함수
function updateTable(data) {
    const tbody = document.querySelector('#myTable tbody');
    tbody.innerHTML = ''; // 기존 테이블 내용 비우기

    data.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${(currentPage - 1) * itemsPerPage + index + 1}</td>
            <td>${item.KIND_NM}</td>
            <td>${item.NM}</td>
            <td>${item.ADDR_OLD}</td>
            <td>${item.STATE}</td>
            <td>${item.TEL}</td>
        `;
        tbody.appendChild(row);
    });

    countData()
}


// 페이지 버튼을 생성하여 페이지 넘버 값에 따라 데이터를 출력하는 함수
function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    pagination.innerHTML = ''; // 페이지네이션 요소 초기화

    // <
    const prevButtonClone = prevButton.cloneNode(true);
    prevButtonClone.addEventListener('click', function() {
        goToPrevPage(totalPages);
    });
    pagination.appendChild(prevButtonClone);

    // 페이지 넘버
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.addEventListener('click', function () {
            currentPage = i;
            const startIndex = (currentPage - 1) * Number(itemsPerPage);
            const endIndex = startIndex + Number(itemsPerPage);
            let pageData;

            if (show_searchData == '') {
                pageData = searchData.slice(startIndex, endIndex);
            } else {
                pageData = show_searchData.slice(startIndex, endIndex);
            }

            updateTable(pageData);
            countData();
            // updatePagination(); // 페이지네이션 업데이트

            // 클릭한 페이지 번호에 해당하는 버튼의 스타일 변경
            const pageButtons = pagination.querySelectorAll('button');
            pageButtons.forEach(button => {
                button.style.fontWeight = 'normal'; // 모든 버튼의 스타일을 초기화
            });
            pageButton.style.fontWeight = 'bold'; // 클릭한 버튼의 스타일 변경
        });

        pagination.appendChild(pageButton);
    }
    
    // >
    const nextButtonClone = nextButton.cloneNode(true);
    nextButtonClone.addEventListener('click', function () {
        goToNextPage(totalPages);
    });
    pagination.appendChild(nextButtonClone);
}

// 이전 페이지로 이동하는 함수
function goToPrevPage(totalPages) {
    if (currentPage > 1) {
        currentPage--;
        console.log(`이전 페이지로 이동합니다. 현재 페이지: ${currentPage}`);
        const startIndex = (currentPage - 1) * Number(itemsPerPage);
        const endIndex = startIndex + Number(itemsPerPage);
        let pageData;

        if (show_searchData == '') {
            pageData = searchData.slice(startIndex, endIndex);
        } else {
            pageData = show_searchData.slice(startIndex, endIndex);
        }

        updateTable(pageData);
        countData();

        // 현재 페이지 번호에 해당하는 버튼의 스타일 변경
        currentPage++;
        const pageButtons = pagination.querySelectorAll('button');
        pageButtons.forEach(button => {
            button.style.fontWeight = 'normal'; // 모든 버튼의 스타일을 초기화
        });
        pagination.querySelector(`button:nth-child(${currentPage})`).style.fontWeight = 'bold'; // 현재 페이지 번호의 버튼 스타일 변경
        currentPage--;
    }
}

// 다음 페이지로 이동하는 함수
function goToNextPage(totalPages) {
    if (currentPage < totalPages) {
        currentPage++;
        console.log(`다음 페이지로 이동합니다. 현재 페이지: ${currentPage}`);
        const startIndex = (currentPage - 1) * Number(itemsPerPage);
        const endIndex = startIndex + Number(itemsPerPage);
        let pageData;

        if (show_searchData == '') {
            pageData = searchData.slice(startIndex, endIndex);
        } else {
            pageData = show_searchData.slice(startIndex, endIndex);
        }

        updateTable(pageData);
        countData();

        // 현재 페이지 번호에 해당하는 버튼의 스타일 변경
        currentPage++;
        const pageButtons = pagination.querySelectorAll('button');
        pageButtons.forEach(button => {
            button.style.fontWeight = 'normal'; // 모든 버튼의 스타일을 초기화
        });
        pagination.querySelector(`button:nth-child(${currentPage})`).style.fontWeight = 'bold'; // 현재 페이지 번호의 버튼 스타일 변경
        currentPage--;
    }
}


// 데이터 총 갯수
function countData() {
    if (show_searchData != '') {
        totalRows.textContent = `총 ${show_searchData.length}개의 데이터`;
    } else {
        totalRows.textContent = `총 ${searchData.length}개의 데이터`;
    }
}
