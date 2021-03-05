let itemsPerPage = 10;

const state = {
  page: 1,
  itemsPerPage,
  numberOfPages: Math.ceil(100 / itemsPerPage),
};

const list = {
  update() {
    const lines = document.querySelectorAll(".lines");
    let items = [];
    for (i = 0; i < lines.length; i++) {
      items.push(lines[i]);
      lines[i].innerHTML = "";
    }
    
    let page = state.page - 1;
    let start = page * state.itemsPerPage;
    let end = start + state.itemsPerPage;

    const currentPage = window.location.href.slice(22);
    window.fetch(`https://jsonplaceholder.typicode.com/${currentPage}`).then((response) => {
      return response.json();
    })
      .then((dados) => {
        const paginatedItems = dados.slice(start, end);
        const isAlbums = currentPage == "albums"

        paginatedItems.forEach((index) => {
          if (isAlbums) {
            document.getElementById("tabela").innerHTML += `<tr class="lines">
          <td>${index.userId}</td>
          <td>${index.id}</td>
          <td>${index.title}</td>
        </tr>`
          }
          else {
            document.getElementById("tabela").innerHTML += `<tr class="lines">
            <td>${index.userId}</td>
            <td>${index.id}</td>
            <td>${index.title}</td>
            <td>${currentPage == "posts" ? index.body : index.completed}</td>
          </tr>`
          }
            document.getElementById("atual").innerText = `${state.page}`;
            
            const atualPage = document.querySelector("#atual").textContent
            const nextButton = document.querySelector(".next")
            const lastPage = document.querySelector(".lastPage")
            
            if (Number(atualPage) == state.numberOfPages) {
              nextButton.disabled = true
              lastPage.disabled = true
            } else {
              nextButton.disabled = false
              lastPage.disabled = false
            }
        });
      });

  },
};

const controls = {
  next() {
    state.page++;
    const lastPage = state.page > state.numberOfPages;
    if (lastPage) {
      state.page--;
    }
  },

  prev() {
    state.page--;
    if (state.page < 1) {
      state.page++;
    }
  },

  goTo(page) {
    state.page = page;
    if (page > state.numberOfPages) {
      state.page = numberOfPages;
    }
  },

  Listeners() {
    document.querySelector(".firstPage").addEventListener("click", () => {
      controls.goTo(1);
      list.update();
    });

    document.querySelector(".lastPage").addEventListener("click", () => {
      controls.goTo(state.numberOfPages);
      list.update();
    });

    document.querySelector(".next").addEventListener("click", () => {
      controls.next();
      list.update();
    });

    document.querySelector(".prev").addEventListener("click", () => {
      controls.prev();
      list.update();
    });

    //   document.querySelector(".filter-button").addEventListener("click", () => {
    //   controls.filterById()
    //   list.update()
    // })
  },
};

function start() {
  list.update();
  controls.Listeners();
};

function filterById() {
  if(window.location.href.slice(22) == "todos"){
    document.querySelector(".input-area").max = 5
  }
  document.querySelector(".filter-button").addEventListener("click", () => {
      const id = document.querySelector(".input-area").valueAsNumber
      if(id){
          const page = window.location.href.slice(22)
          window.fetch(`https://jsonplaceholder.typicode.com/${page}?userId=${id}`)
          .then(response => {
              return response.json()
          }).then(filterData => {
            function setState() {
                state.page = id 
                document.getElementById("atual").innerText = id
            }
              const dataInPage = document.getElementsByClassName("lines")
              for(j = 0; j<dataInPage.length; j++){dataInPage[j].innerHTML = ""}
              for(i = 0; i < dataInPage.length; i++){
                  if(page == "albums"){
                    dataInPage[i].innerHTML = `<tr class="lines">
                  <td>${filterData[i].userId}</td>
                  <td>${filterData[i].id}</td>
                  <td>${filterData[i].title}</td>
                </tr>`
                  }
                  else {
                    dataInPage[i].innerHTML = `<tr class="lines">
                  <td>${filterData[i].userId}</td>
                  <td>${filterData[i].id}</td>
                  <td>${filterData[i].title}</td>
                  <td>${page == "posts" ? filterData[i].body : filterData[i].completed}</td>
                </tr>`
                  }
                  setState()
              }  
          }) 
      }
      else{
        window.alert("O id para a filtragem deve estar entre 1 e 10")
      }
  })
};


start();
filterById();