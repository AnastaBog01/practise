document.addEventListener('DOMContentLoaded', function() {
  const yearSelect = document.getElementById('year'); //выпадающий список для года
  const monthSelect = document.getElementById('month'); // выпадающий список для месяцев
  const updateChartButton = document.getElementById('updateChart'); //кнопка для графика что бы он обновлялся
  const ctx = document.getElementById('myChart').getContext('2d'); //сам график

  let myChart = null; //тут хранится график

  const GENDER_ID = {
    1: 'Самец',
    2: 'Самка'
  };

  const BREED_ID = {
    1: 'Собака, беспородная',
    2: 'Кошка, беспородная'
  };

  const EVENT_KIND = {
    1: 'Отлов',
    2: 'Первичный осмотр',
    4: 'Клинический осмотр',
    12: 'Содержание',
    9: 'Возврат в прежнюю среду'
  };

  //Функция для загрузки данных из JSON
  async function fetchData() {
      const response = await fetch('animals.json'); //запрос на загрузку
      if (!response.ok) {
        throw new Error(`Ошибка загрузки данных: ${response.status}`); //если запрос е прошел
      }
      const data = await response.json(); //конвертирует в джава скрипт объект
      return data; //возвращает получившиеся данные
  }

  //В этой функции график обновляется в заваисимости от того, какой год и месяц выбран
  function updateChart() {
    const selectedYear = yearSelect.value; //значение года
    const selectedMonth = monthSelect.value; //значение месяца

    fetchData().then(data => {
      if (!data) {
        console.warn('Данные не загружены, график не будет отображен.'); //если данных нет, то ничего не выведется
        return;
      }

      //Работа с данными
      const filteredData = data.reduce((acc, animal) => {
        animal.ordered_event_objects.forEach(event => {
          if (event.kind === 1) { //проверка что мы ищем по отлову
              const eventDate = new Date(event.execution_date.split(' ')[0].split('.').reverse().join('-')); //преобразование даты в Date
              const eventYear = eventDate.getFullYear(); //получаем год события
              const eventMonth = eventDate.getMonth() + 1; //месяц события

              // console.log('Обрабатываемое событие:', event);
              // console.log('Год события:', eventYear);
              // console.log('Месяц события:', eventMonth);

              if (eventYear.toString() === selectedYear && eventMonth.toString() === selectedMonth) {
                const day = eventDate.getDate();
                acc[day] = (acc[day] || 0) + 1;
              }
          }
        });
        return acc;
      }, {});

      // console.log('Отфильтрованные данные:', filteredData);

      // if (Object.keys(filteredData).length === 0) {
      //   console.warn('Нет данных для отображения.');
      //   return;
      // }

      const labels = Object.keys(filteredData).sort((a, b) => a - b); //сортировка и получение дней месяцев
      const counts = labels.map(day => filteredData[day]); //количество животных в день

      // console.log("Labels:", labels);
      // console.log("Counts:", counts);

      if (myChart) {
        myChart.destroy();
      }

      //Тут график
        myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'Количество отловленных животных за месяц',
              data: counts,
              borderWidth: 3,
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Количество животных'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'День месяца'
                }
              }
            }
          }
        });
    });
  }

  updateChart(); //новый график
  updateChartButton.addEventListener('click', updateChart);//новый график когда нажимается кнопка
});

