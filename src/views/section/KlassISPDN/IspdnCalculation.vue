<template>
  <div>
    <div id="UzFormContainer" style="margin: 0 auto; background: #fff; padding: 0px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow-x: auto;">
<p><strong>Название ИС: </strong><span class="text-success"><strong>{{ systemName }}</strong></span></p>
<p><strong>Тип ИС: </strong><span class="text-success"><strong>{{ systemType }}</strong></span></p>
<p><strong>Обработка персональных данных: </strong><span class="text-success"><strong>{{ systemPers }}</strong></span></p>
      <!-- Наличие/отсутствие недокументированных возможностей -->
    <div style="margin-top: 0px; background: #f0f0f0; padding: 0px; border-radius: 5px;">
    <!-- Тип угроз -->
    <span class="tooltip_note"><strong>Выберите тип Угроз: </strong></span>
    <select class="form-select" v-model="ugroza" @change="updateResult">
      <option value="1">НДВ в системном ПО (Тип Угроз 1)</option>
      <option value="2">НДВ в прикладном ПО (Тип Угроз 2)</option>
      <option value="3">Нерассматариваются НДВ (Тип Угроз 3)</option>
    </select>
    
    <!-- комментарии по выбранному типу угроз -->

    <div class="alert alert-dismissible alert-primary" v-html="ugrozaComments"></div>
    </div>

	
    <div style="margin-top: 0px; background: #f0f0f0; padding: 0px; border-radius: 5px;">
	<!-- Тип ИСПДн -->
        <span class="tooltip_note"><strong>Выберите тип ИСПДн: </strong></span>
        <select class="form-select" v-model="type_ispdn" @change="updateResult">
          <option value="s21">Специальная ИСПДн</option>
          <option value="s22">Биометрическая ИСПДн</option>
          <option value="s23">Общедоступная ИСПДн</option>
          <option value="s24">Иная ИСПДн</option>
        </select>
<!-- комментарии по выбранному типу ИСПДн -->

  <div class="alert alert-dismissible alert-primary" v-html="selectedIspdnComment"></div>
</div>

      <div style="margin-top: 0px; background: #f0f0f0; padding: 0px; border-radius: 5px;">
      <!-- Субьекты персональных данных -->
        <span class="tooltip_note"><strong>Выберите субьектов персональных данных: </strong></span>
        <select class="form-select" v-model="type_sotrud" @change="updateResult" :disabled="isSotrudDisabled">
          <option value="s31">Сотрудники организации</option>
          <option value="s32">Иные лица</option>
        </select>
      </div>
      <!-- Количество субъектов ПДн -->

        <span class="tooltip_note"><strong>Выберите количество субъектов ПДн:</strong></span>
        <select class="form-select" v-model="kolvo" @change="updateResult" :disabled="isKolvoDisabled">
          <option value="s41">Менее 100 000 человек</option>
          <option value="s42">Более 100 000 человек</option>
        </select>
      </div>

      <p>&nbsp;</p>

      <!-- После блока с результатом переход-->
<div style="margin-top: 20px; text-align: center;">
  <button class="btn btn-primary" @click="goNextStep">Далее</button>
</div>
    </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  emits: ['next-step'],
  setup(props, { emit }) {
const goNextStep = () => {
  emit('next-step', class_ispdn.value); // передаем уровень
console.log(class_ispdn);
};
    // реактивные переменные
    const ugroza = ref(1);
    const type_ispdn = ref('s21');
    const type_sotrud = ref('s31');
    const kolvo = ref('s41');
const ispdnCommentsMap = {
  s21: `<strong>Вы выбрали <strong>Специальная ИСПДн</strong>. Убедитесь в правильности выбора.</strong><br/>
Специальные персональные данные — которые касаются состояния здоровья, сексуальной жизни субъекта, его политических, философских и религиозных воззрений, а также расовой и половой принадлежности. Доступ к такой информации предоставляется только по решению суда, в рамках работы органов правосудия, при реализации международных соглашений либо после получения письменного разрешения владельца.`,

  s22: `<strong>Вы выбрали <strong>Биометрическая ИСПДн</strong>. Убедитесь в правильности выбора.</strong><br/>
Биометрические персональные данные — любые биологические либо физиологические особенности, которые дают возможность определить личность субъекта, к примеру, ДНК, фотографии, группа крови, рисунок сетчатки глаза, отпечатки пальцев и т.д. Оператору для обработки подобных ПДн нужно предварительно получить разрешение (за исключением случаев, когда есть судебное решение либо речь идет о расследовании преступлений). Однако если хранение осуществляется не с целью установления личности, то сведения не относятся к категории биометрических ПДн (в зависимости от ситуации их можно определить как специальные либо общедоступные).`,

  s23: `<strong>Вы выбрали <strong>Общедоступная ИСПДн</strong>. Убедитесь в правильности выбора.</strong><br/>
Общедоступные персональные данные — те, которые опубликованы в открытых источниках с согласия владельца (если субъект хочет удалить сведения, он может подать заявление оператору либо обратиться в суд). К таким относятся дата, место рождения, адрес прописки и проживания, профессия и место работы, адрес электронной почты, телефонный номер, образование.`,

  s24: `<strong>Вы выбрали <strong>Иная ИСПДн</strong>. Убедитесь в правильности выбора.</strong><br/>
Иные персональные данные — которые нельзя определить ни в одну из других групп. Фактически, это дополнительная информация о человеке, которая часто меняется: размер зарплаты, социальный статус, рабочий стаж, длительность и даты отпуска и т.д.`,
};
    // объект с комментариями для каждого типа угроз
    const ugrozaCommentsMap = {
      1: `<strong>Вы выбрали <strong>первый тип угроз</strong>. Убедитесь в правильности выбора.</strong><br/>\n\
К этому типу относятся угрозы, при которых в используемом системном ПО (Операционной системе) могут быть недекларируемые возможности (НДВ), или так называемые закладки. Например, с помощью закладок в операционной системе злоумышленик может в любой момент получить к ней доступ. Обычно это операционные системы устновленные с недоверенных источников и не имеющие сертификацию по требованиям ИБ.<br/>\n\
<p class="text-danger"><strong>При применении настроеных сертифицированных средств защиты от НСД, межсетевого экрана, сканера безопасности, средств антивирусной защиты и средств криптографической защиты информации в информационной системе, угрозы 1-го типа связанные с наличием недокументированных (недекларированных) возможностей в системном программном обеспечении используемом в ИС нейтрализуются и <strong>не рассматриваются.</strong></strong></p>`,
      2: `<strong>Вы выбрали <strong>второй тип угроз</strong>. Убедитесь в правильности выбора.</strong><br/>\n\
К этому типу относятся угрозы, в виде закладок в прикладном программном обеспечении например 1С или Веб-приложении. Обычно они появляются в ситуациях, когда ПО разрабатывалось специально для заказчика или скачивалось с недоверенных источников.
<p class="text-danger"><strong>При применении настроек сертифицированных средств защиты от НСД, межсетевого экрана, сканера безопасности, средств антивирусной защиты и средств криптографической защиты информации в информационной системе, угрозы 2-го типа связанные с наличием недокументированных (недекларированных) возможностей в прикладном программном обеспечении используемом в ИС нейтрализуются и <strong>не рассматриваются.</strong></strong></p>`,
      3: `<strong>Вы выбрали <strong>третий тип угроз</strong>. Убедитесь в правильности выбора.</strong><br/>\n\
К этому типу угроз принято относить все остальные угрозы, не связанные с системными или программными закладками. Например, если вы уверены в системном и прикладном ПО то это может быть угроза взлома пароля.
<p class="text-danger"><strong>Угрозы 3-го типа не связанные с наличием недокументированных (недекларированных) возможностей в системном и прикладном программном обеспечении, используемом в информационной системе в связи с тем, что их практически невозможно полностью нейтрализовать организационными и техническими мерами.</p></strong>`,
    };
    // вычисляем комментарий по текущему выбору
    const ugrozaComments = computed(() => {
      return ugrozaCommentsMap[ugroza.value] || '';
    });
    // вычисляем комментарий по текущему выбору испдн
    const selectedIspdnComment = computed(() => {
      return ispdnCommentsMap[type_ispdn.value] || '';
    });
    // вычисляем уровень защиты
    const class_ispdn = computed(() => {
      const ugrozaVal = Number(ugroza.value);
      const typeIspdnVal = type_ispdn.value;
      const typeSotrudVal = type_sotrud.value;
      const kolvoVal = kolvo.value;

      let resultLevel;

      if (typeIspdnVal === 's22') {
        // Биометрическая
        resultLevel = ugrozaVal;
      } else {
        if (typeIspdnVal === 's21') {
          // Специальная
          if (ugrozaVal === 1) {
            resultLevel = ugrozaVal;
          } else {
            if (typeSotrudVal === 's31') {
              resultLevel = ugrozaVal;
            } else {
              if (kolvoVal === 's41') {
                resultLevel = ugrozaVal;
              } else {
                resultLevel = ugrozaVal - 1;
              }
            }
          }
        } else if (typeIspdnVal === 's23') {
          // Общедоступная
          if (ugrozaVal === 1 || ugrozaVal === 3 || typeSotrudVal === 's31') {
            resultLevel = ugrozaVal + 1;
          } else {
            if (kolvoVal === 's41') {
              resultLevel = ugrozaVal + 1;
            } else {
              resultLevel = ugrozaVal;
            }
          }
        } else if (typeIspdnVal === 's24') {
          // Иная
          if (ugrozaVal === 1 || (kolvoVal === 's42' && typeSotrudVal === 's32')) {
            resultLevel = ugrozaVal;
          } else {
            resultLevel = ugrozaVal + 1;
          }
        } else {
          resultLevel = ugrozaVal; // дефолт
        }
      }
  return {
    level: resultLevel,
    ugroza: ugrozaVal,
    typeIspdn: type_ispdn.value,
    typeSotrud: type_sotrud.value,
    kolvo: kolvo.value,
  };
    });

    // управляем disabled состоянием
    const isKolvoDisabled = computed(() => {
      return ugroza.value === 1 || (type_ispdn.value === 's22');
    });
    const isSotrudDisabled = computed(() => {
      return ugroza.value === 1 || (type_ispdn.value === 's22');
    });


    // функция для обновления результата при изменениях
    const updateResult = () => {
      // В данном случае ничего не нужно, так как computed автоматически обновляют результат
    };

    return {
      ugroza,
      type_ispdn,
      type_sotrud,
      kolvo,
      isKolvoDisabled,
      isSotrudDisabled,
      updateResult,
      ugrozaComments, // добавляем для шаблона
      selectedIspdnComment,
      goNextStep,
    };
  },
  props: {
systemName: String,
systemType: String,
systemPers: String,
},
};
</script>

<style>
/* добавьте стили при необходимости */
</style>
