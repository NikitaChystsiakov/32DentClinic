// Единый источник услуг, цен, врачей направлений и FAQ — config/services.ts.
// Раньше здесь лежала копия без поля `availableIn`, и цену приходилось
// менять в двух местах; теперь файл только реэкспортирует конфиг, чтобы
// прайс (/ceny/), калькулятор, форма записи и каталог сети (/uslugi/)
// читали те же данные, что и страницы городов.
export {
  serviceCategories,
  getServiceBySlug,
  getServicesForCity,
  serviceSelectOptions,
  formatProcedurePrice,
  withProcedureGroups,
  type Procedure,
  type FaqItem,
  type ServiceCategory,
} from '@/config/services'
