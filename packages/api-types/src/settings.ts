/*!
 * Source https://github.com/manniwatch/manniwatch
 */

/**
 * @hidden
 */
type CountryCodes = ['ab', 'aa', 'af', 'sq', 'am', 'ar', 'hy', 'as', 'ay', 'az',
    'ba', 'eu', 'bn', 'dz', 'bh', 'bi', 'br', 'bg', 'my', 'be', 'km', 'ca', 'zh', 'co', 'hr', 'cs',
    'da', 'nl', 'en', 'eo', 'et', 'fo', 'fj', 'fi', 'fr', 'fy', 'gd', 'gl', 'ka', 'de', 'el', 'kl',
    'gn', 'gu', 'ha', 'iw', 'hi', 'hu', 'is', 'in', 'ia', 'ie', 'ik', 'ga', 'it', 'ja', 'jw', 'kn',
    'ks', 'kk', 'rw', 'ky', 'rn', 'ko', 'ku', 'lo', 'la', 'lv', 'ln', 'lt', 'mk', 'mg', 'ms', 'ml',
    'mt', 'mi', 'mr', 'mo', 'mn', 'na', 'ne', 'no', 'oc', 'or', 'om', 'ps', 'fa', 'pl', 'pt', 'pa',
    'qu', 'rm', 'ro', 'ru', 'sm', 'sg', 'sa', 'sr', 'sh', 'st', 'tn', 'sn', 'sd', 'si', 'ss', 'sk',
    'sl', 'so', 'es', 'su', 'sw', 'sv', 'tl', 'tg', 'ta', 'tt', 'te', 'th', 'bo', 'ti', 'to', 'ts',
    'tr', 'tk', 'tw', 'uk', 'ur', 'uz', 'vi', 'vo', 'cy', 'wo', 'xh', 'ji', 'yo', 'zu'];
/**
 * @hidden
 */
type ValuesOf<T extends CountryCodes> = T[number];
/**
 * @hidden
 */
type AnyCombination<T extends CountryCodes> = T[keyof T][];
/**
 * @since 0.5.0
 */
export interface ISettings {
    /**
     * eg. de en ar
     */
    AVAILABLE_LANGUAGES: AnyCombination<CountryCodes>;
    DEFAULT_TIME_PREVIEW: number;
    GEOLOCATION_ENABLED: boolean;
    INITIAL_LAT: number;
    INITIAL_LON: number;
    INITIAL_ZOOM: number;
    /**
     * language code
     * eg. de en ar
     */
    LANGUAGE: ValuesOf<CountryCodes>;
    MAP_ENABLED: boolean;
    MAP_SHOW_CONTROLS: boolean;
    MAP_SHOW_PATTERNS: boolean;
    MAP_SHOW_STOPS: boolean;
    MAP_SHOW_VEHICLES: boolean;
    MAX_ZOOM: number;
    MIN_ZOOM: number;
    MOBILE_ENABLED: boolean;
    SEARCH_BY_ROUTES_ENABLED: boolean;
    SEARCH_BY_STOPPOINTS_ENABLED: boolean;
    SHOW_ABOUT_DEPARTURE_TEXT: boolean;
    SHOW_ACTUAL_COLUMN: boolean;
    SHOW_DEPARTING_TEXT: boolean;
    SHOW_DEP_ARR_TEXT: boolean;
    SHOW_LANGUAGE_BAR: boolean;
    SHOW_MIXED_COLUMN: boolean;
    SHOW_PASSAGETYPE_COLUMN: boolean;
    SHOW_SCHEDULE_COLUMN: boolean;
    SUPPRESS_COUNTDOWN_TIME_INCREMENT: boolean;
    TIMESLIDER_ENABLED: boolean;
}
