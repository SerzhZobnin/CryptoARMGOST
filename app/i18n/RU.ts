export default {
  Agreement: {
    agreement: "Соглашение",
    Agreement: "СОГЛАШЕНИЕ",
  },
  Certificate: {
    Certificate: "СЕРТИФИКАТЫ",
    FCertificates: "СЕРТИФИКАТАМИ",
    certificate: "Сертификат",
    certs: "Сертификаты",
    key_import_ok: "Ключ привязан к сертификату",
    key_import_failed: "Не удалось привязать ключ",
    cert_info: "Сведения о сертификате",
    cert: "Сертификаты",
    cert_not_found: "Сертификаты не найдены",
    cert_not_select: "Сертификат не выбран",
    Select_Cert_Sign: "ВЫБРАТЬ СЕРТИФИКАТ ПОДПИСИ",
    cert_chain: "Цепочка сертификации",
    serialNumber: "Серийный номер",
    thumbprint: "Отпечаток",
    version: "Версия",
    subject: "Владелец сертификата",
    organization: "Организация",
    issuer: "Кем выдан",
    cert_valid: "Годен до",
    import_key: "Импортировать ключ",
    priv_key: "Закрытый ключ",
    issuer_name: "Издатель",
    present: "Присутствует",
    absent: "Отсутствует",
    cert_status_true: "действителен",
    cert_status_false: "недействителен",
    cert_chain_status: "Общий статус цепочки",
    cert_chain_status_true: "действительна",
    cert_chain_status_false: "недействительна",
    cert_chain_info: "Состав цепочки",
    cert_export: "Экспортировать",
    export_cert: "Экспорт сертификата",
    cert_export_ok: "Сертификат успешно экспортирован",
    cert_export_cancel: "Отмена экспорта сертификата",
    cert_export_failed: "Не удалось экспортировать сертификат",
    cert_import_ok: "Сертификат успешно импортирован",
    cert_import_failed: "Не удалось импортировать сертификат",
    cert_load_failed: "Не удалось прочитать сертификат",
    cert_import: "Импортировать",
    Select_Cert_Encrypt: "ВЫБРАТЬ СЕРТИФИКАТ ПОЛУЧАТЕЛЯ",
    certs_encrypt: "Сертификаты шифрования",
    certs_getters: "Сертификаты получателей",
    cert_imported: "Сертификат уже импортирован",
    certs_my: "Личные сертификаты",
    certs_other: "Сертификаты других пользователей",
    certs_intermediate: "Промежуточные сертификаты",
    certs_root: "Доверенные корневые сертификаты",
    certs_token: "Сертификаты внешних носителей",
  },
  CSR: {
    create_selfSigned: "Создание самоподписанного сертификата",
    template_label: "Шаблон сертификата",
    template_default: "Шаблон по умолчанию",
    template_additional_fields: "Шаблон с расширенным списокм полей",
    template_kep_ip: "Сертификат КЭП индивидуального предпринимателя",
    template_kep_fiz: "Сертификат КЭП физичексого лица",
    csp_label: "Используемый криптопровайдер",
    csp_openssl: "OpenSSL RSA",
    csp_microsoft_base: "Microsoft Base Cryptografic Provaider v1.0",
    not_after: "Действителен до",
    generate_new_key: "Создать новый ключевой набор",
    key_length: "Длина ключа",
    country: "Страна",
    common_name: "CN",
    organization_name: "Организация",
    locality_name: "Город",
    province_name: "Область",
    email_address: "Email адрес",
  },
  Key: {
    key_load_failed: "Не удалось прочитать ключ",
  },
  Encrypt: {
    archive_name: "encrypt_files.zip",
    files_archived: "Файлы заархивированы",
    files_encrypt: "Файлы зашифрованы",
    files_encrypt_failed: "При шифровании произошла ошибка",
    files_archived_failed: "При архивировании произошла ошибка",
    decrypt_key_failed: "Не удалось найти ключ",
    files_decrypt: "Файлы расшифрованы",
    files_decrypt_failed: "Во время расшифровывания произошла ошибка",
    encrypt_and_decrypt: "Зашифровать / расшифровать",
    encrypt: "Зашифровать",
    Encrypt: "ЗАШИФРОВАТЬ",
    decrypt: "Расшифровать",
    Encryption: "ШИФРОВАНИЕ",
    encrypt_setting: "Настройки шифрования",
    delete_files_after: "Удалить файлы после шифрования",
    archive_files_before: "Архивировать перед шифрованием",
    search_decrypt_cert_failed: "Не удается найти сертификат расшифровывания",
  },
  Sign: {
    sign_and_verify: "Подписать / Проверить подпись",
    sign: "Подписать",
    resign: "Добавить",
    unsign: "Снять",
    Sign: "ПОДПИСАТЬ",
    Signature: "ПОДПИСЬ",
    verify: "Проверить",
    load_sign_failed: "Ошибка чтения файла подписи",
    files_signed: "Файлы подписаны",
    files_signed_failed: "При подписи файлов произошла ошибка",
    files_resigned_failed: "При добавлении подписи произошла ошибка",
    files_resigned_exist: "Подпись уже существует. Выберите другой сертификат",
    files_resigned: "Подпись добавлена",
    files_unsigned_failed: "При снятии подписи произошла ошибка",
    files_unsigned_detached: "Открепленная подпись",
    files_unsigned_ok: "Снятие подписи закончено успешно",
    verify_sign_ok: "Проверка подписей прошла успешно",
    verify_sign_founds_errors: "При проверке подписи обнаружены ошибки",
    verify_signercontent_founds_errors: "При проверке контента подписчика обнаружены ошибки",
    verify_sign_failed: "Не удалось проверить подпись",
    verify_signers_failed: "Не удалось проверить подписчиков",
    verify_get_content_failed: "Исходный файл не найден",
    set_content_failed: "Ошибка установки исходного контента",
    build_chain_failed: "Не удалось построить цепочку",
    sign_info: "Информация о подписи",
    sign_content_file: "Выбор исходного файла для подписи: ",
    sign_detached: "Сохранить подпись отдельно",
    sign_time: "Добавить время подписи",
    sign_setting: "Настройки подписи",
    sign_ok: "Подпись действительна",
    sign_error: "Подпись недействительна",
    key_not_found: "Не удалось найти ключ",
    signercert_not_found: "Не удалось найти сертификат подписчика",
    status: "Статус",
    alg: "Алгоритм подписи",
    digest_alg: "Алгоритм хэширования",
  },
  Settings: {
    settings: "Настройки",
    encoding: "Кодировка",
    directory_file_save: "Директория для сохранения файла",
    failed_find_directory: "Указанная директория не существует",
    DER: "DER",
    BASE: "BASE-64",
    add_files: "Добавить файлы",
    selected_all: "Выделить все",
    remove_selected: "Сбросить выделение",
    remove_all_files: "Удалить все из списка",
    drag_drop: "Перетащите в это поле мышкой",
    open_file: "Открыть файл",
    go_to_file: "Перейти к файлу",
    delete_file: "Удалить из списка",
    write_file_failed: "Ошибка записи в файл",
    write_file_ok: "Настройки сохранены",
    setting_file: "settings.json",
    field_empty: "Поле не может быть пустым",
    email_error: "Некорректный e-mail",
    choose_files: "Выбрать файлы",
    choose: "Выбрать",
    remove_list: "Очистить список",
    print: "Печать",
    Control: "УПРАВЛЕНИЕ",
    Datas: "ДАННЫХ",
    Digital: "ЭЛЕКТРОННАЯ",
    pass_enter: "Ввод пароля",
    password: "Пароль",
    wait: "Пожалуйста, подождите...",
  },
  Help: {
    help: "Справка",
    Help: "СПРАВКА",
    Work_App: "РАБОТА С ПРИЛОЖЕНИЕМ В ДЕТАЛЯХ",
    video: [
      {
        src: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Typing_example.ogv",
        title: "СОЗДАНИЕ ПОДПИСИ",
      },
      {
        src: "http://www.youtubeinmp4.com/redirect.php?video=6Dc1C77nra4",
        title: "ШИФРОВАНИЕ",
      },
      {
        src: "https://upload.wikimedia.org/wikipedia/commons/6/65/Examplevideo.ogv",
        title: "ОПЕРАЦИИ С СЕРТИФИКАТАМИ",
      },
      {
        src: "https://upload.wikimedia.org/wikipedia/commons/transcoded/1/14/Xacti-AC8EX-Sample_video-001.ogg/Xacti-AC8EX-Sample_video-001.ogg.360p.ogv",
        title: "ПРОВЕРКА ПОДПИСИ",
      },
      {
        src: "https://upload.wikimedia.org/wikipedia/en/6/6e/Terminator.ogg",
        title: "РАСШИФРОВАНИЕ",
      },
      {
        src: "http://html5videoformatconverter.com/data/images/happyfit2.mp4",
        title: "РАБОТА С СЕРВИСОМ TRUSTED NET",
      },
    ],
    video_failed: "Невозможно воспроизвести данное видео... Проверьте соединение с интернетом.",
  },
  About: {
    about: "О программе",
    About: "О ПРОГРАММЕ",
    message_send: "Сообщение отправлено",
    error_message_send: "Ошибка при отправке сообщения",
    version_full: "Версия продукта: 1.2.0",
    version: "1.2.0",
    version_app: "Версия приложения",
    build_number: "Номер сборки",
    product_NAME: "Trusted eSign",
    product_name: "Trusted eSign",
    FeedBack: "ОБРАТНАЯ СВЯЗЬ",
    username: "Имя",
    email: "Email",
    message: "Сообщение",
    send: "Отправить",
    Contacts: "КОНТАКТЫ",
    company_name: "ООО Цифровые технологии",
    copyright: "Copyright 2016-2017",
    address: "424033, РМЭ, г.Йошкар-Ола, ул.Петрова, д.1, а/я 67",
    phone: {
      number_one: "8 (8362) 33-70-50",
      number_two: "8 (499) 705-91-10",
      number_three: "8 (800) 555-65-81",
    },
    Info: "Информация",
    info: "info @trusted.ru",
    about_programm: "Приложение Trusted eSign предназначено для создания электронной подписи и шифрования файлов с применением цифровых сертификатов и криптографических алгоритмов",
    info_about_product: "Приложение Trusted eSign предназначено для создания электронной подписи и шифрования файлов с применением цифровых сертификатов и криптографических алгоритмов",
    info_about_sign: "Операции с электронной подписью для любых типов документов и произвольного контента",
    info_about_encrypt: "Защита пакетов документов и произвольного контента с помощью шифрования в адрес одного или нескольких получателей",
    info_about_certificate: "Централизованное управление локальными и облачными хранилищами сертификатов",
    link_facebook: "https://www.facebook.com/cryptoarm/",
    link_vk: "http://vk.com/cryptoarm",
    link_twitter: "https://twitter.com/cryptoarm",
    link_trusred: "http://www.trusted.ru/",
  },
  License: {
    license: "Лицензия",
    License: "ЛИЦЕНЗИЯ",
    About_License: "СВЕДЕНИЯ О ЛИЦЕНЗИИ",
    license_key: "Лицензионный ключ",
    Enter_Key: "ВВЕСТИ КЛЮЧ",
    entered_the_key: "Выполните ввод ключа",
    key_file_name: "desktopkey.lic",
    failed_key_find: "Лицензионный ключ отсутствует",
    failed_validity_key: "Срок действия лицензионного ключа истёк",
    failed_match_key: "Лицензионный ключ не подходит для данного продукта",
    failed_key: "Неверный ключ",
    key: "Ключ",
    Entered: "ВВЕСТИ",
    enter_key: "Ввод лицензиии",
    lic_file_not_found: "Файл лицензии не найден",
    lic_file_uncorrect: "Некорректный лицензинный файл",
    lic_key_uncorrect: "Некорректный лицензионный ключ",
    lic_key_correct: "Действительна (Осталось дней: ",
    lic_key_correct_days: "Срок действия лицензии истечет через: ",
    lic_key_setup: "Лицензионный ключ успешно установлен",
    lic_file_choose: "Выберите файл лицензии",
    lic_status: "Статус лицензии",
    lic_notbefore: "Дата выдачи",
    lic_notafter: "Дата истечения",
    jwtErrorInternal: "Ошибка проверки лицензии",
    jwtErrorLoad: "Ошибка чтения лицензии",
    jwtErrorTokenFormat: "Неверный формат лицензии",
    jwtErrorSign: "Ошибка проверки подписи лицензии",
    jwtErrorParsing: "Ошибка парсинга лицензии",
    jwtErrorStructure: "Ошибка в структуре лицензии",
    jwtErrorProduct: "Лицензия не подходит для данной программы",
    jwtErrorExpired: "Срок действия лицензии истек",
    jwtErrorStarted: "Срок действия лицензии не наступил",
    jwtErrorOperation: "Неизвестная операция",
    jwtErrorNoLicenseInStore: "Не найдена лицензия для данной операции",
    jwtErrorStoreIsLocked: "Чтение лицензии заблокировано",
    jwtErrorCode: "Неизвестный код ошибки",
  },
  Кegistration: {
    LoginAndPass: "АВТОРИЗАЦИЯ ПО ЛОГИНУ И ПАРОЛЮ",
    Social: "АВТОРИЗАЦИЯ ЧЕРЕЗ СОЦИАЛЬНЫЕ СЕТИ",
    Cert: "АВТОРИЗАЦИЯ ПО СЕРТИФИКАТУ",
    RLoginAndPass: "ПО ЛОГИНУ И ПАРОЛЮ",
    RSocial: "ЧЕРЕЗ СОЦ.СЕТИ",
    RCert: "ПО СЕРТИФИКАТУ",
    login: "Логин",
    enter: "Войти",
    sign_up: "Зарегистрироваться",
    choose_reg: "ВЫБЕРИТЕ СПОСОБ АВТОРИЗАЦИИ НА СЕРВИСЕ TRUSTED NET",
    enter_service: "Войти на сервис",
    App_Functions: "НЕСКОЛЬКО ПОЛЕЗНЫХ ФУНКЦИИ ПРИЛОЖЕНИЯ",
    Empowerment: "РАСШИРЕНИЕ ВОЗМОЖНОСТЕЙ С ПОДКЛЮЧЕНИЕМ К СЕРВИСУ TRUSTED NET",
  },
  Common: {
    yes: "Да",
    no: "Нет",
    add_files: "Добавление файлов",
    add_all_files: "Добавить файлы из всех подкаталогов?",
    ru: "Русский",
    en: "Английский",
    read_file_error: "Ошибка при чтении из файла",
    write_file_error: "Ошибка при записи в файл",
    or: "или",
    subject: "Владелец",
    product: "Продукт",
    files_not_found: "Файлы не найдены (Возможно они были удалены или переименованы)",
    Back: "НАЗАД",
  },
};
