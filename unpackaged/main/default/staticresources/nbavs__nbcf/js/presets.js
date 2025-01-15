'use strict';

/* Presets */

var timezones = ["Africa/Abidjan", "Africa/Accra", "Africa/Addis_Ababa", "Africa/Algiers", "Africa/Asmara", "Africa/Bamako", "Africa/Bangui", "Africa/Banjul", "Africa/Bissau", "Africa/Blantyre", "Africa/Brazzaville", "Africa/Bujumbura", "Africa/Cairo", "Africa/Casablanca", "Africa/Ceuta", "Africa/Conakry", "Africa/Dakar", "Africa/Dar_es_Salaam", "Africa/Djibouti", "Africa/Douala", "Africa/El_Aaiun", "Africa/Freetown", "Africa/Gaborone", "Africa/Harare", "Africa/Johannesburg", "Africa/Juba", "Africa/Kampala", "Africa/Khartoum", "Africa/Kigali", "Africa/Kinshasa", "Africa/Lagos", "Africa/Libreville", "Africa/Lome", "Africa/Luanda", "Africa/Lubumbashi", "Africa/Lusaka", "Africa/Malabo", "Africa/Maputo", "Africa/Maseru", "Africa/Mbabane", "Africa/Mogadishu", "Africa/Monrovia", "Africa/Nairobi", "Africa/Ndjamena", "Africa/Niamey", "Africa/Nouakchott", "Africa/Ouagadougou", "Africa/Porto-Novo", "Africa/Sao_Tome", "Africa/Tripoli", "Africa/Tunis", "Africa/Windhoek", "America/Adak", "America/Anchorage", "America/Anguilla", "America/Antigua", "America/Araguaina", "America/Argentina/Buenos_Aires", "America/Argentina/Catamarca", "America/Argentina/Cordoba", "America/Argentina/Jujuy", "America/Argentina/La_Rioja", "America/Argentina/Mendoza", "America/Argentina/Rio_Gallegos", "America/Argentina/Salta", "America/Argentina/San_Juan", "America/Argentina/San_Luis", "America/Argentina/Tucuman", "America/Argentina/Ushuaia", "America/Aruba", "America/Asuncion", "America/Atikokan", "America/Bahia", "America/Bahia_Banderas", "America/Barbados", "America/Belem", "America/Belize", "America/Blanc-Sablon", "America/Boa_Vista", "America/Bogota", "America/Boise", "America/Cambridge_Bay", "America/Campo_Grande", "America/Cancun", "America/Caracas", "America/Cayenne", "America/Cayman", "America/Chicago", "America/Chihuahua", "America/Costa_Rica", "America/Creston", "America/Cuiaba", "America/Curacao", "America/Danmarkshavn", "America/Dawson", "America/Dawson_Creek", "America/Denver", "America/Detroit", "America/Dominica", "America/Edmonton", "America/Eirunepe", "America/El_Salvador", "America/Fortaleza", "America/Glace_Bay", "America/Godthab", "America/Goose_Bay", "America/Grand_Turk", "America/Grenada", "America/Guadeloupe", "America/Guatemala", "America/Guayaquil", "America/Guyana", "America/Halifax", "America/Havana", "America/Hermosillo", "America/Indiana/Indianapolis", "America/Indiana/Knox", "America/Indiana/Marengo", "America/Indiana/Petersburg", "America/Indiana/Tell_City", "America/Indiana/Vevay", "America/Indiana/Vincennes", "America/Indiana/Winamac", "America/Inuvik", "America/Iqaluit", "America/Jamaica", "America/Juneau", "America/Kentucky/Louisville", "America/Kentucky/Monticello", "America/Kralendijk", "America/La_Paz", "America/Lima", "America/Los_Angeles", "America/Lower_Princes", "America/Maceio", "America/Managua", "America/Manaus", "America/Marigot", "America/Martinique", "America/Matamoros", "America/Mazatlan", "America/Menominee", "America/Merida", "America/Metlakatla", "America/Mexico_City", "America/Miquelon", "America/Moncton", "America/Monterrey", "America/Montevideo", "America/Montreal", "America/Montserrat", "America/Nassau", "America/New_York", "America/Nipigon", "America/Nome", "America/Noronha", "America/North_Dakota/Beulah", "America/North_Dakota/Center", "America/North_Dakota/New_Salem", "America/Ojinaga", "America/Panama", "America/Pangnirtung", "America/Paramaribo", "America/Phoenix", "America/Port-au-Prince", "America/Port_of_Spain", "America/Porto_Velho", "America/Puerto_Rico", "America/Rainy_River", "America/Rankin_Inlet", "America/Recife", "America/Regina", "America/Resolute", "America/Rio_Branco", "America/Santa_Isabel", "America/Santarem", "America/Santiago", "America/Santo_Domingo", "America/Sao_Paulo", "America/Scoresbysund", "America/Shiprock", "America/Sitka", "America/St_Barthelemy", "America/St_Johns", "America/St_Kitts", "America/St_Lucia", "America/St_Thomas", "America/St_Vincent", "America/Swift_Current", "America/Tegucigalpa", "America/Thule", "America/Thunder_Bay", "America/Tijuana", "America/Toronto", "America/Tortola", "America/Vancouver", "America/Whitehorse", "America/Winnipeg", "America/Yakutat", "America/Yellowknife", "Antarctica/Casey", "Antarctica/Davis", "Antarctica/DumontDUrville", "Antarctica/Macquarie", "Antarctica/Mawson", "Antarctica/McMurdo", "Antarctica/Palmer", "Antarctica/Rothera", "Antarctica/South_Pole", "Antarctica/Syowa", "Antarctica/Vostok", "Arctic/Longyearbyen", "Asia/Aden", "Asia/Almaty", "Asia/Amman", "Asia/Anadyr", "Asia/Aqtau", "Asia/Aqtobe", "Asia/Ashgabat", "Asia/Baghdad", "Asia/Bahrain", "Asia/Baku", "Asia/Bangkok", "Asia/Beirut", "Asia/Bishkek", "Asia/Brunei", "Asia/Choibalsan", "Asia/Chongqing", "Asia/Colombo", "Asia/Damascus", "Asia/Dhaka", "Asia/Dili", "Asia/Dubai", "Asia/Dushanbe", "Asia/Gaza", "Asia/Harbin", "Asia/Hebron", "Asia/Ho_Chi_Minh", "Asia/Hong_Kong", "Asia/Hovd", "Asia/Irkutsk", "Asia/Jakarta", "Asia/Jayapura", "Asia/Jerusalem", "Asia/Kabul", "Asia/Kamchatka", "Asia/Karachi", "Asia/Kashgar", "Asia/Kathmandu", "Asia/Khandyga", "Asia/Kolkata", "Asia/Krasnoyarsk", "Asia/Kuala_Lumpur", "Asia/Kuching", "Asia/Kuwait", "Asia/Macau", "Asia/Magadan", "Asia/Makassar", "Asia/Manila", "Asia/Muscat", "Asia/Nicosia", "Asia/Novokuznetsk", "Asia/Novosibirsk", "Asia/Omsk", "Asia/Oral", "Asia/Phnom_Penh", "Asia/Pontianak", "Asia/Pyongyang", "Asia/Qatar", "Asia/Qyzylorda", "Asia/Rangoon", "Asia/Riyadh", "Asia/Sakhalin", "Asia/Samarkand", "Asia/Seoul", "Asia/Shanghai", "Asia/Singapore", "Asia/Taipei", "Asia/Tashkent", "Asia/Tbilisi", "Asia/Tehran", "Asia/Thimphu", "Asia/Tokyo", "Asia/Ulaanbaatar", "Asia/Urumqi", "Asia/Ust-Nera", "Asia/Vientiane", "Asia/Vladivostok", "Asia/Yakutsk", "Asia/Yekaterinburg", "Asia/Yerevan", "Atlantic/Azores", "Atlantic/Bermuda", "Atlantic/Canary", "Atlantic/Cape_Verde", "Atlantic/Faroe", "Atlantic/Madeira", "Atlantic/Reykjavik", "Atlantic/South_Georgia", "Atlantic/St_Helena", "Atlantic/Stanley", "Australia/Adelaide", "Australia/Brisbane", "Australia/Broken_Hill", "Australia/Currie", "Australia/Darwin", "Australia/Eucla", "Australia/Hobart", "Australia/Lindeman", "Australia/Lord_Howe", "Australia/Melbourne", "Australia/Perth", "Australia/Sydney", "Europe/Amsterdam", "Europe/Andorra", "Europe/Athens", "Europe/Belgrade", "Europe/Berlin", "Europe/Bratislava", "Europe/Brussels", "Europe/Bucharest", "Europe/Budapest", "Europe/Busingen", "Europe/Chisinau", "Europe/Copenhagen", "Europe/Dublin", "Europe/Gibraltar", "Europe/Guernsey", "Europe/Helsinki", "Europe/Isle_of_Man", "Europe/Istanbul", "Europe/Jersey", "Europe/Kaliningrad", "Europe/Kiev", "Europe/Lisbon", "Europe/Ljubljana", "Europe/London", "Europe/Luxembourg", "Europe/Madrid", "Europe/Malta", "Europe/Mariehamn", "Europe/Minsk", "Europe/Monaco", "Europe/Moscow", "Europe/Oslo", "Europe/Paris", "Europe/Podgorica", "Europe/Prague", "Europe/Riga", "Europe/Rome", "Europe/Samara", "Europe/San_Marino", "Europe/Sarajevo", "Europe/Simferopol", "Europe/Skopje", "Europe/Sofia", "Europe/Stockholm", "Europe/Tallinn", "Europe/Tirane", "Europe/Uzhgorod", "Europe/Vaduz", "Europe/Vatican", "Europe/Vienna", "Europe/Vilnius", "Europe/Volgograd", "Europe/Warsaw", "Europe/Zagreb", "Europe/Zaporozhye", "Europe/Zurich", "Indian/Antananarivo", "Indian/Chagos", "Indian/Christmas", "Indian/Cocos", "Indian/Comoro", "Indian/Kerguelen", "Indian/Mahe", "Indian/Maldives", "Indian/Mauritius", "Indian/Mayotte", "Indian/Reunion", "Pacific/Apia", "Pacific/Auckland", "Pacific/Chatham", "Pacific/Chuuk", "Pacific/Easter", "Pacific/Efate", "Pacific/Enderbury", "Pacific/Fakaofo", "Pacific/Fiji", "Pacific/Funafuti", "Pacific/Galapagos", "Pacific/Gambier", "Pacific/Guadalcanal", "Pacific/Guam", "Pacific/Honolulu", "Pacific/Johnston", "Pacific/Kiritimati", "Pacific/Kosrae", "Pacific/Kwajalein", "Pacific/Majuro", "Pacific/Marquesas", "Pacific/Midway", "Pacific/Nauru", "Pacific/Niue", "Pacific/Norfolk", "Pacific/Noumea", "Pacific/Pago_Pago", "Pacific/Palau", "Pacific/Pitcairn", "Pacific/Pohnpei", "Pacific/Port_Moresby", "Pacific/Rarotonga", "Pacific/Saipan", "Pacific/Tahiti", "Pacific/Tarawa", "Pacific/Tongatapu", "Pacific/Wake", "Pacific/Wallis", "UTC"];

var predefinedMacros = [
        {
            "macro": "$(ActiveRecAnswerEpochMS)",
            "type": "Simple",
            "call policy": false,
            "category": "Time/ Date",
            "non-call policy/data connector": true,
            "description": "The epoch value (in milliseconds) for when the Active Record Call was answered by the Call Recorder. This epoch value in synced to NTP and is provided to millisecond granularity. Together with the $(ActiveRecCLI) macro."
        },
        {
            "macro": "$(ActiveRecAudio)",
            "type": "Simple",
            "call policy": false,
            "category": "Active Record",
            "non-call policy/data connector": true,
            "description": "An indication as to whether there is audio included in the Active Record channel. If Active Record couldn't send audio to the remote recorder because the call was relayed via a Non Camel network or the Active Record channel couldn't be connected."
        },
        {
            "macro": "$(ActiveRecCLI)",
            "type": "Simple",
            "call policy": false,
            "category": "Active Record",
            "non-call policy/data connector": true,
            "description": "The E164 CLI that was presented in the Active Record Call Leg to the Call Recorder. This will be used by the Call Recorder to associate the meta-data item with the audio record in the recorder."
        },
        {
            "macro": "$(ActiveRecCLILocal)",
            "type": "Simple",
            "call policy": false,
            "category": "Active Record",
            "non-call policy/data connector": true,
            "description": "The CLI (Calling Line Indicator) that was sent to the Active Recorder. This is typically used in non-call policies to send meta-data to the call recorder and provide an indication of the CLI that was specified on a given call. This macro provides the CLI in national format according to the Organisation's Home Country Code setting."
        },
        {
            "macro": "$(ActiveRecCreatedEpochMS)",
            "type": "Simple",
            "call policy": false,
            "category": "Active Record",
            "non-call policy/data connector": true,
            "description": "The epoch value (in milliseconds) when the Active Record channel for a given call was created by the platform."
        },
        {
            "macro": "$(ActiveRecName)",
            "type": "Simple",
            "call policy": true,
            "category": "Active Record",
            "non-call policy/data connector": true,
            "description": "The identity name of the Active Record recorder that was used by the Red Matter switch. In a scenario where multiple recorders are configured in a parallel or serial dialled architecture for redundancy."
        },
        {
            "macro": "$(ActiveRecSetupDelayMS)",
            "type": "Simple",
            "call policy": false,
            "category": "Active Record",
            "non-call policy/data connector": true,
            "description": "Value in milliseconds of how long the Active Record Call leg took to establish. Useful for diagnostics purposes."
        },
        {
            "macro": "$(ActiveRecStatus)",
            "type": "Simple",
            "call policy": false,
            "category": "Active Record",
            "non-call policy/data connector": true,
            "description": "Indicates the recording status of the Conversational Call relating to this meta-data item.Initialised: The Active Record sub-item has been initialised."
        },
        {
            "macro": "$(CallAnswerEpochMS)",
            "type": "Simple",
            "call policy": false,
            "category": "Time/ Date",
            "non-call policy/data connector": true,
            "description": "The epoch value (in milliseconds) detailing when the call was answered. This epoch value is synced to NTP and is provided to millisecond granularity. Note that this value may significantly differ from the $(RecordAnswerEpochMS) value since a call may have been buffered and re-streamed."
        },
        {
            "macro": "$(CallCategory)",
            "type": "Simple",
            "call policy": false,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "The Call Category type for a channel."
        },
        {
            "macro": "$(CallComponentStartName)",
            "type": "Simple",
            "call policy": true,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "The application that was activated when the channel routed via the dial-plan policy."
        },
        {
            "macro": "$(CallConnected)",
            "type": "Simple",
            "call policy": false,
            "category": "Call Statistics",
            "non-call policy/data connector": true,
            "description": "Indicates if the call was connected to the called party. If connected then the macro will expand to the value 'Yes'. If not connected, then it expands to 'No'."
        },
        {
            "macro": "$(CallDurationSeconds)",
            "type": "Simple",
            "call policy": true,
            "category": "Call Statistics",
            "non-call policy/data connector": true,
            "description": "The number of seconds that the call was active for from the point that the caller first initiates the call."
        },
        {
            "macro": "$(CalledCountryShort)",
            "type": "Simple",
            "call policy": true,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "The three letter ISO code of the country that was called. For example GBR or FRA (for UK and France) respectively."
        },
        {
            "macro": "$(CalledNumber)",
            "type": "Simple",
            "call policy": true,
            "category": "Numbers",
            "non-call policy/data connector": true,
            "description": "Expands to the dialled number.If the call is an Inbound Call, then this will be the PSTN number that the call was accepted on. It will be in national dial format if the number matches the Home Country Code of the Organisation or User, e.g. 07740123456. If it is an international caller number then it will be in E164 format without the +, e.g. 3339329328392 for a French Caller Number (note the leading 33 French country code).\n\nIf the call is an Outbound Call, then this will be a PSTN number the user dialled. It will be in national dial format if the number matches the Home Country Code of the Organisation or User, e.g. 07740123456. If it is an international caller number then it will be in E164 format without the +, e.g.3339329328392 for a French Caller Number (note the leading 33 French country code).\n\nIf call withheld and/or external access prefixes have been used on the number then these are all stripped. For example, if country code is UK (44), external access is 9 and withheld is 141, then: 07740980123 -> 07740980123, 0033243123456 -> 33243123456, 907740980123 -> 07740980123, 914107740980123 -> 07740980123"
        },
        {
            "macro": "$(CalledNumberIn)",
            "type": "Simple",
            "call policy": true,
            "category": "Numbers",
            "non-call policy/data connector": true,
            "description": "Expands to the inbound dialled number.\n\nIf the call is an Inbound Call from the PSTN, then this will be the PSTN number that was dialled and subsequently accepted by the dial-plan policy. If this is a DDI, then it will be the dialled DDI number that the call was accepted on. It will be in national dial format if the number matches the Home Country Code of the Organisation or User, e.g. 0158223456. If the number is an international number, then it will be in E164 format without the +, e.g. 3339329328392 for a French Caller Number (note the leading 33 french country code).\n\nIf this macro is used elsewhere on a dial-plan policy where a call has not been received from the PSTN, then it will expand as empty."
        },
        {
            "macro": "$(CalledRoaming)",
            "type": "Simple",
            "call policy": true,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "If the called number (of the Conversational Call) is a roaming subscriber mobile on the platform, then this indicates the country the call is being made to. The format is the three letter ISO country code. For example GBR or FRA (for UK and France) respectively."
        },
        {
            "macro": "$(CallEndDate)",
            "type": "Simple",
            "call policy": false,
            "category": "Time/ Date",
            "non-call policy/data connector": true,
            "description": "Expands to the end date and time of the call. The format is yyyy-mm-dd hh:mm:ss, e.g. 2011-05-28 23:43:21"
        },
        {
            "macro": "$(CallEndDateShort)",
            "type": "Simple",
            "call policy": false,
            "category": "Time/ Date",
            "non-call policy/data connector": true,
            "description": "The date that the call was hung up. This is presented in the format yyyy-mm-dd, e.g. 2015-05-12"
        },
        {
            "macro": "$(CallEndDateUTC)",
            "type": "Simple",
            "call policy": false,
            "category": "Time/ Date",
            "non-call policy/data connector": true,
            "description": "The time that the call was hung up in UTC format, This is presented in the format yyyy-mm-dd\Thh:mm:ss\Z, e.g. 2015-05-12T12:34:54Z"
        },
        {
            "macro": "$(CallEndEpoch)",
            "type": "Simple",
            "call policy": true,
            "category": "Time/ Date",
            "non-call policy/data connector": true,
            "description": "The epoch time that the call was hung up in epoch time, i.e. number of seconds since 1st January 1970 GMT."
        },
        {
            "macro": "$(CallEndEpochMS)",
            "type": "Simple",
            "call policy": false,
            "category": "Time/ Date",
            "non-call policy/data connector": true,
            "description": "The time that the call was hung up in epoch time, i.e. number of seconds since 1st January 1970 GMT."
        },
        {
            "macro": "$(CallEndTime)",
            "type": "Simple",
            "call policy": false,
            "category": "Time/ Date",
            "non-call policy/data connector": true,
            "description": "The time that the call was hung up. This is presented in the format hh:mm:ss,  e.g. 12:34:54"
        },
        {
            "macro": "$(CallerCountryShort)",
            "type": "Simple",
            "call policy": true,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "The three letter country code associated with the caller number, e.g. FRA for France."
        },
        {
            "macro": "$(CallerEmailAddress)",
            "type": "Simple",
            "call policy": true,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "The caller's email address (which will be the same as their login name), if the caller has an account on the service, otherwise the result is blank."
        },
        {
            "macro": "$(CallerFirstName)",
            "type": "Simple",
            "call policy": true,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "The caller's first name, if the caller has an account on the service, otherwise the result is blank."
        },
        {
            "macro": "$(CallerGroup)",
            "type": "Simple",
            "call policy": true,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "The caller's primary group name, if the caller has an account on the service, otherwise the result is blank."
        },
        {
            "macro": "$(CallerLastName)",
            "type": "Simple",
            "call policy": true,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "The caller's last name, if the caller has an account on the service, otherwise the result is blank."
        },
        {
            "macro": "$(CallerNumber)",
            "type": "Simple",
            "call policy": true,
            "category": "Numbers",
            "non-call policy/data connector": true,
            "description": "$(CallerNumber) expands to the caller number.If the call is an Inbound Call, then this will be a PSTN number. It will be in national dial format if the number matches the Home Country Code of the Organisation or User, e.g. 07740123456. If it is an international caller number then it will be in E164 format without the +, e.g. 3339329328392 for a French Caller Number (note the leading 33 french country code).\n\nIf the call is an Outbound Call, then this will be the user's extension if a user is mapped to a device.\n\nIf no user is mapped to the calling device, then this will be the device extension number.\n\nThe value returned will be the SIP User part (in preference) from the P-Preferred-Identity, P-Asserted-Identity, Remote-Party-ID, and the From header received by the Soft Switch."
        },
        {
            "macro": "$(CallerRoaming)",
            "type": "Simple",
            "call policy": true,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "If the caller is a roaming mobile (must be a subscriber of the Service), then this indicates the country from which the call is being made from. The format is the three letter ISO country code. For example GBR or FRA (for UK and France) respectively."
        },
        {
            "macro": "$(CallerType)",
            "type": "Simple",
            "call policy": true,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "Indicates the type of caller. It will be one of three values. \ndevice: indicates the caller is a device and no user is mapped to that device\nuser: indicates the caller is a user\nexternal: indicates the caller is external"
        },
        {
            "macro": "$(CallerUserAgent)",
            "type": "Simple",
            "call policy": true,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "The user agent name of the calling phone."
        },
        {
            "macro": "$(CallHuntSeconds)",
            "type": "Simple",
            "call policy": false,
            "category": "Call Statistics",
            "non-call policy/data connector": true,
            "description": "Number of seconds that the call took to hunt for a connection. Hunt time is calculated as the time between which the call is answered by the platform and the time to then connect that call to a device."
        },
        {
            "macro": "$(CallOwner)",
            "type": "Simple",
            "call policy": true,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "Indicates which platform subscriber logically owns the call, i.e. which user the call is associated with. Values are 'Caller', 'Called', 'Unknown'."
        },
        {
            "macro": "$(CallPolicyStartName)",
            "type": "Simple",
            "call policy": true,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "The dial-plan policy that was activated when the channel was initiated."
        },
        {
            "macro": "$(CallQueueElapsedTime)",
            "type": "Simple",
            "call policy": true,
            "category": "Call Queue",
            "non-call policy/data connector": false,
            "description": "Expands to the number of seconds a call has been queuing for."
        },
        {
            "macro": "$(CallQueueElapsedTimeSpoken)",
            "type": "Simple",
            "call policy": true,
            "category": "Call Queue",
            "non-call policy/data connector": false,
            "description": "Expands to a spoken duration that the call has been queuing for. The macro can only be used in announcements. As an example if a call has been queuing for 90 seconds, this macro will expand to '1 minute 30 seconds'. Note that some voices support translation of this to local language. Please refer to Text To Speech documentation for more info."
        },
        {
            "macro": "$(CallQueuePos)",
            "type": "Simple",
            "call policy": true,
            "category": "Call Queue",
            "non-call policy/data connector": false,
            "description": "Expands to the position of the call in the call queue. Note that this can only be used in Call Queues."
        },
        {
            "macro": "$(CallRingSeconds)",
            "type": "Simple",
            "call policy": false,
            "category": "Call Statistics",
            "non-call policy/data connector": true,
            "description": "Number of seconds the channel was ringing for before the platform answered the call."
        },
        {
            "macro": "$(CallSecondsToAnswer)",
            "type": "Simple",
            "call policy": false,
            "category": "Call Statistics",
            "non-call policy/data connector": true,
            "description": "Number of seconds the channel was in a ring state for before it was answered."
        },
        {
            "macro": "$(CallStartDate)",
            "type": "Simple",
            "call policy": true,
            "category": "Time/ Date",
            "non-call policy/data connector": true,
            "description": "The start date and time of the call. The format is yyyy-mm-dd hh:mm:ss"
        },
        {
            "macro": "$(CallStartDateShort)",
            "type": "Simple",
            "call policy": false,
            "category": "Time/ Date",
            "non-call policy/data connector": true,
            "description": "The date that the call was initiated, i.e. received by the platform or initiated by the platform. This is presented in the format yyyy-mm-dd, e.g. 2015-05-12."
        },
        {
            "macro": "$(CallStartDateUTC)",
            "type": "Simple",
            "call policy": false,
            "category": "Time/ Date",
            "non-call policy/data connector": true,
            "description": "The time that the call was initiated, i.e. received by the platform or initiated by the platform in UTC format, e.g. yyyy-mm-dd\Thh:mm:ss\Z, e.g. 2015-05-12T12:34:54Z."
        },
        {
            "macro": "$(CallStartEpoch)",
            "type": "Simple",
            "call policy": true,
            "category": "Time/ Date",
            "non-call policy/data connector": true,
            "description": "The time that the call was initiated, i.e. received by the platform or initiated by the platform in epoch time, i.e. number of seconds since 1st January 1970 GMT."
        },
        {
            "macro": "$(CallStartEpochMS)",
            "type": "Simple",
            "call policy": false,
            "category": "Time/ Date",
            "non-call policy/data connector": true,
            "description": "The time that the call was initiated, i.e. received by the platform or initiated by the platform in epoch time, i.e. number of milliseconds since 1st January 1970 GMT."
        },
        {
            "macro": "$(CallStartTime)",
            "type": "Simple",
            "call policy": false,
            "category": "Time/ Date",
            "non-call policy/data connector": true,
            "description": "The time that the call was initiated, i.e. received by the platform or initiated by the platform. This is presented in the format hh:mm:ss, e.g. 12:34:54."
        },
        {
            "macro": "$(CallTalkSeconds)",
            "type": "Simple",
            "call policy": false,
            "category": "Call Statistics",
            "non-call policy/data connector": true,
            "description": "The number of seconds that the call was active for from the point that the called party accepted the call."
        },
        {
            "macro": "$(ConnectedEmailAddress)",
            "type": "Simple",
            "call policy": true,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "If the call is connected to the called party, and the called party has an account on the service, then the $(ConnectedEmailAddress) macro will expand to their configured to their email address, which will be the same as their login name. If no account is found and/or the call is not connected then the result will be blank."
        },
        {
            "macro": "$(ConnectedFirstName)",
            "type": "Simple",
            "call policy": true,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "If the call is connected to the called party, and the called party has an account on the service, then the $(ConnectedFirstName) macro will expand to their configured first name, otherwise the result is blank."
        },
        {
            "macro": "$(ConnectedGroup)",
            "type": "Simple",
            "call policy": false,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "If the call is connected to the called party, and the called party has an account on the service, then the $(ConnectedGroup) macro will expand to their configured primary group if have one configured, otherwise the result is blank."
        },
        {
            "macro": "$(ConnectedLastName)",
            "type": "Simple",
            "call policy": true,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "If the call is connected to the called party, and the called party has an account on the service, then the $(ConnectedLastName) macro will expand to their configured last name."
        },
        {
            "macro": "$(ConnectedNumber)",
            "type": "Simple",
            "call policy": true,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "If the call is connected to the called party, and the called party is an external PSTN number, this will be the number of that party.\n\nIt will be in national dial format if the number matches the Home Country Code of the Organisation or User, e.g. 07740123456. If it is an international caller number then it will be in E164 format without the +, e.g. 3339329328392 for a French Caller Number (note the leading 33 French country code)."
        },
        {
            "macro": "$(ConnectedType)",
            "type": "Simple",
            "call policy": true,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "The type of the target that the call was connected to. If the call is connected to an external number, then this will be external. If connected to a user, then the value will be user, and finally if connected to an internal phone with no user mapped, the value will be device. If the call is not connected, the value will be blank."
        },
        {
            "macro": "$(ConnectedUserAgent)",
            "type": "Simple",
            "call policy": true,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "If the connected phone makes its user agent name available in the SIP headers, then this expands the name."
        },
        {
            "macro": "$(ConnectedUUID)",
            "type": "Simple",
            "call policy": true,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "Expands to the unique ID of the connected call leg."
        },
        {
            "macro": "$(Custom_[field])",
            "type": "Complex",
            "call policy": true,
            "category": "Special",
            "non-call policy/data connector": true,
            "description": "A Custom Macro that has been created by the user of the platform. e.g. $(Custom_MyFavColour)."
        },
        {
            "macro": "$(DeviceId)",
            "type": "Simple",
            "call policy": false,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "The Device Id that is connected to the current channel being processed by the Non Call Policy. If no Device Id is connected to the channel, then an empty value is returned."
        },
        {
            "macro": "$(DialledNumber)",
            "type": "Simple",
            "call policy": true,
            "category": "Numbers",
            "non-call policy/data connector": true,
            "description": "The number that was actually dialled by the caller. This will include any prefix codes such as 9 (for an external number) or 141 (to withhold a CLI). If the call had been made via a dial-plan policy extension, then the DialledNumber would be the dial-plan policy extension that was dialled."
        },
        {
            "macro": "$(E164CalledNumber)",
            "type": "Simple",
            "call policy": true,
            "category": "Numbers",
            "non-call policy/data connector": true,
            "description": "The dialled number in E164 format. The same rules as for the $(CalledNumber) apply, except that the number will be an E164 formatted number without the leading +."
        },
        {
            "macro": "$(E164CalledNumberIn)",
            "type": "Simple",
            "call policy": true,
            "category": "Numbers",
            "non-call policy/data connector": true,
            "description": "The inbound dialled number in E164 format. The same rules as for the $(CalledNumberIn) apply, except that the number will be always be an E164 formatted number without the leading +."
        },
        {
            "macro": "$(E164CallerNumber)",
            "type": "Simple",
            "call policy": true,
            "category": "Numbers",
            "non-call policy/data connector": true,
            "description": "The caller number in E164 format. If the call is an Inbound Call, then this will be a PSTN number. It will be in E164 format without the +, e.g. 447740123456 for a UK number.\n\nIn the Call is an Outbound Call, then the macro will be empty, i.e. there is no E164 version of a user extension. The value returned will be the SIP User part (in preference) from the P-Preferred-Identity, P-Asserted-Identity, Remote-Party-ID, and the From header received by the Soft Switch. "
        },
        {
            "macro": "$(E164ConnectedNumber)",
            "type": "Simple",
            "call policy": true,
            "category": "Numbers",
            "non-call policy/data connector": true,
            "description": "If the call is connected to the called party, and the called party is an external PSTN number, this will be the number of that party.\n\nThe same rules as for $(ConnectedNumber) apply, except that the number will be an E164 formatted number without the leading +."
        },
        {
            "macro": "$(E164DiversionNumber)",
            "type": "Simple",
            "call policy": true,
            "category": "Numbers",
            "non-call policy/data connector": true,
            "description": "If the called number has a diversion configured on it by an external provider, then this macro will expand to that number. Note that not all third party providers will provide diversion information."
        },
        {
            "macro": "$(ExtensionNumber)",
            "type": "Simple",
            "call policy": true,
            "category": "Numbers",
            "non-call policy/data connector": true,
            "description": "Expands to the Extension Number of the channel."
        },
        {
            "macro": "$(Fn_Rand{randNumLen})",
            "type": "Function",
            "call policy": true,
            "category": "Functions",
            "non-call policy/data connector": false,
            "description": "A Randomisation function to return a random number of up randNumLen length. Replace randNumLen parameter with a digit value"
        },
        {
            "macro": "$(Fn_UUID)",
            "type": "Function",
            "call policy": true,
            "category": "Functions",
            "non-call policy/data connector": false,
            "description": "A function to return a UUID"
        },
        {
            "macro": "$(HangupCause)",
            "type": "Simple",
            "call policy": true,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "The hangup cause indicating how and why the call was terminated."
        },
        {
            "macro": "$(HoldTime)",
            "type": "Simple",
            "call policy": false,
            "category": "Call Statistics",
            "non-call policy/data connector": true,
            "description": "Amount of time in seconds the channel was placed on hold"
        },
        {
            "macro": "$(HomeCountryCode)",
            "type": "Simple",
            "call policy": true,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "The telephone country code that is defined for the user or organisation, as set on the call channel. For example, in the the UK this will be 44."
        },
        {
            "macro": "$(HTTP_[field])",
            "type": "Complex",
            "call policy": true,
            "category": "Data Source",
            "non-call policy/data connector": true,
            "description": "A Complex macro for access responses from the HTTP Connector."
        },
        {
            "macro": "$(MobileNumber)",
            "type": "Simple",
            "call policy": true,
            "category": "Numbers",
            "non-call policy/data connector": false,
            "description": "The Mobile Number associated with the user record. If a user is not associated with the call, then blank entry is returned."
        },
        {
            "macro": "$(OriginateDisposition)",
            "type": "Simple",
            "call policy": false,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "Returns the origination disposition for a channel, e.g. an indication of whether the call was connected successfully, and if not the reason why. For example, if the channel was busy, the disposition value might be USER_BUSY."
        },
        {
            "macro": "$(OwnerEmail)",
            "type": "Simple",
            "call policy": false,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "The email address for the owner of the call."
        },
        {
            "macro": "$(OwnerFirstName)",
            "type": "Simple",
            "call policy": false,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "The first name for the owner of the call."
        },
        {
            "macro": "$(OwnerLastName)",
            "type": "Simple",
            "call policy": false,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "The last name for the owner of the call."
        },
        {
            "macro": "$(OwnerUserId)",
            "type": "Simple",
            "call policy": false,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "Returns the logical owner's UserId of the channel. For example, when a call is made to a DDI or a Mobile number, the A Leg of the channel will not be attached to the User and won't necessarily have a UserID; this will belong to the B Leg. However, since the number will most likely be connected to the User (by virtue of the fact they own the Number), this macro indicates that ownership."
        },
        {
            "macro": "$(PolicyStartType)",
            "type": "Simple",
            "call policy": true,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "Indicates which Start sub-item type the call was initiated through:\npublic: The call initiated on the Start/Number app\n extension_hook: The call initiated on the Extension app\noutbound_hook: The call initiated on the outbound app\nDDI: The call initiated on the DDI app\ndefault: The call did not start on any of the standard apps and was handled internally via the default policies"
        },
        {
            "macro": "$(Recording)",
            "type": "Simple",
            "call policy": true,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "Expands to a URL link to the voice recording, if voice recording has been enabled on the call."
        },
        {
            "macro": "$(RecordingB)",
            "type": "Simple",
            "call policy": true,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "Expands to a URL link to the voice recording on the B channel, if voice recording has been enabled on the call."
        },
        {
            "macro": "$(RecordingPaused)",
            "type": "Simple",
            "call policy": false,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "Indicates if the recording was paused. Valid values are 'yes' and 'no'."
        },
        {
            "macro": "$(Redirected)",
            "type": "Simple",
            "call policy": false,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "Indication if the call has been Redirected. There are two forms of redirect; a late forward (redirect has occurred on phone) and early forward (redirect has occurred as a result of the MNO). Possible values are 'LateFwd' and 'EarlyFwd'. In the case of a LateFwd, it is possible that the redirected call leg will cause another recording to occur on the recorder as in essence these are two separate call legs. Note that this feature is only available on selected MNO call flows."
        },
        {
            "macro": "$(ScreenCaller)",
            "type": "Simple",
            "call policy": true,
            "category": "Call Properties",
            "non-call policy/data connector": false,
            "description": "Only available in Scripting Engine. Indicates if the B Leg has requested that Call Screening should be enabled. Valid values are 'yes' or 'no'"
        },
        {
            "macro": "$(Service)",
            "type": "Simple",
            "call policy": false,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "Indicates which service (if any) the Conversational Ccall was connected to. Typically, this would indicate voicemail. Other example services could include: Voicemail, Record, Call Return, Voicemail Login, Echo."
        },
        {
            "macro": "$(SMSBody)",
            "type": "Simple",
            "call policy": false,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "If processing an SMS, return the body of the SMS."
        },
        {
            "macro": "$(SMSDirection)",
            "type": "Simple",
            "call policy": false,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "If processing an SMS, return the direction of the SMS. Valid values are sent and received."
        },
        {
            "macro": "$(SMSSentDateUTC)",
            "type": "Simple",
            "call policy": false,
            "category": "Time/ Date",
            "non-call policy/data connector": true,
            "description": "If processing an SMS, return the Sent Date of the SMS in UTC format."
        },
        {
            "macro": "$(SMSSentEpoch)",
            "type": "Simple",
            "call policy": false,
            "category": "Time/ Date",
            "non-call policy/data connector": true,
            "description": "If processing an SMS, return the Sent Date of the SMS in epoch format."
        },
        {
            "macro": "$(SolidCall)",
            "type": "Simple",
            "call policy": false,
            "category": "Call Statistics",
            "non-call policy/data connector": true,
            "description": "Expands to yes or no dependent on whether the call is regarded as solid."
        },
        {
            "macro": "$(SolidCallThreshold)",
            "type": "Simple",
            "call policy": false,
            "category": "Call Statistics",
            "non-call policy/data connector": true,
            "description": "Expands to the value in seconds of the Solid Call Threshold."
        },
        {
            "macro": "$(System_Transfer.[field])",
            "type": "Complex",
            "call policy": false,
            "category": "Special",
            "non-call policy/data connector": true,
            "description": "Provides a set of records detailing the transfer history for the call. The transfer history is provided in the context of the leg of the call that the record is being accessed. The transfer history provides one record for each `other` leg that the call was connected to during it's lifetime."
        },
        {
            "macro": "$(TotalCallTalkSeconds)",
            "type": "Simple",
            "call policy": false,
            "category": "Call Statistics",
            "non-call policy/data connector": true,
            "description": "The number of seconds that the call spent in talk mode, i.e. the period a call was connected between two 'real' users."
        },
        {
            "macro": "$(UserID)",
            "type": "Simple",
            "call policy": false,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "The unique User ID for the user that owns this channel."
        },
        {
            "macro": "$(UUID)",
            "type": "Simple",
            "call policy": true,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "Unique reference to the channel on the platform. The UUID can be used to find the full CDR information on the platform for future diagnostics."
        },
        {
            "macro": "$(VoiceMailUserId)",
            "type": "Simple",
            "call policy": false,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "If the channel connected to a voice mail service to record a voice mail, then this macro will expand to the User Id that owns that particular voice mail box."
        },
        {
            "macro": "$(ConnectedUserId)",
            "type": "Simple",
            "call policy": false,
            "category": "Call Properties",
            "non-call policy/data connector": true,
            "description": "If the call is connected to another User in the organisation, then this macro will expand to the User ID that is associated with that user."
        }
    ];

var dialplanTemplates = [
    {
        "id": 1,
        "parentId": null,
        "templateClass": "ModNumber",
        "name": "Start",
        "type": "CALL",
        "description": "DialPlan Start provides various components which are entry points for the dial plan",
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": true,
        "jsonSchema": {
            "type": "object",
            "additionalProperties": false,
            "properties": {}
        }
    },
    {
        "id": 2,
        "parentId": null,
        "templateClass": "ModFromPolicy",
        "name": "From Policy",
        "type": "SYSTEM",
        "description": "DialPlan Start provides various components which are entry points for the dial plan from other policies",
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": true,
        "jsonSchema": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "emailTechSupportOnError": {
                    "type": "boolean",
                    "required": false,
                    "default": true,
                    "description": "Send emails to support for debug when errors occur",
                    "render": "checkbox"
                },
                "nextId": {
                    "type": "string",
                    "pattern": "^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$",
                    "required": true,
                    "description": "Next item to connect this module to",
                    "render": false,
                }
            }
        }
    },
    {
        "id": 3,
        "parentId": 1,
        "templateClass": "ModNumber_Public",
        "name": "Number",
        "type": "CALL",
        "description": "A public number that can be dialled from the external telephone network",
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": false,
        "jsonSchema": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "delayBeforeAnswering": {
                    "type": "integer",
                    "minimum": 0,
                    "required": false,
                    "default": 0,
                    "description": "How many ring tones must be sent to the caller before the call is answered"
                },
                "ringtone": {
                    "type": "string",
                    "enum": [
                        "UK",
                        "AU",
                        "IN",
                        "TH",
                        "US",
                        "FR",
                        "BONG",
                        "AUTO"
                    ],
                    "required": false,
                    "default": "AUTO",
                    "description": "The ringtone that will be played to the caller"
                },
                "publicNumber": {
                    "type": "string",
                    "pattern": "^\\+{0,1}\\d+$",
                    "required": true,
                    "description": "Number to intercept"
                },
                "callerIdName": {
                    "type": [
                        "string",
                        "null"
                    ],
                    "pattern": "^[A-Za-z0-9_\\- ]+$",
                    "minLength": 1,
                    "required": false,
                    "default": null,
                    "description": "Override the Caller ID name"
                },
                "billModel": {
                    "type": "string",
                    "enum": [
                        "OUT_CHARGE",
                        "STANDARD"
                    ],
                    "required": false,
                    "default": "STANDARD",
                    "description": "Override billing model on this number"
                },
                "nextId": {
                    "type": "integer",
                    "minimum": 0,
                    "required": true,
                    "description": "Link if this number is dialled",
                    "render": false,
                }
            }
        }
    },

    {
        "id": 38,
        "parentId": 1,
        "templateClass": "ModNumber_PublicDDI",
        "name": "DDI Numbers",
        "type": "CALL",
        "description": "A Direct Dial In catch all for numbers dialled from the external telephone network",
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": false,
        "jsonSchema": {
            "type": "object",
            "additionalProperties": false,
            "hideConfig": true,
            "properties": {
                "delayBeforeAnswering": {
                    "type": "integer",
                    "minimum": 0,
                    "required": false,
                    "default": 1,
                    "description": "How many ring tones must be sent to the caller before the call is answered",
                    "render": false,
                },
                "ringtone": {
                    "type": "string",
                    "enum": [
                        "AUTO",
                        "UK",
                        "AU",
                        "IN",
                        "TH",
                        "US",
                        "FR",
                        "BONG"
                    ],
                    "required": false,
                    "default": "AUTO",
                    "description": "The ringtone that will be played to the caller",
                    "render": false,
                },
                "callerIdName": {
                    "type": [
                        "string",
                        "null"
                    ],
                    "pattern": "^[A-Za-z0-9_\\- ]+$",
                    "minLength": 1,
                    "required": false,
                    "default": null,
                    "description": "Override the Caller ID name",
                    "render": false,
                },
                "nextId": {
                    "type": "string",
                    "pattern": "^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$",
                    "required": true,
                    "description": "Link if this number is dialled",
                    "render": false
                }
            }
        }
    },


    {
        "id": 39,
        "parentId": 1,
        "templateClass": "ModNumber_OutboundExternal",
        "name": "Outbound Numbers",
        "type": "CALL",
        "description": "Any outbound dialled number",
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": false,
        "jsonSchema": {
            "type": "object",
            "additionalProperties": false,
            "hideConfig": true,
            "properties": {
                "fakeMedia": {
                    "type": "boolean",
                    "required": false,
                    "default": true,
                    "description": "Create fake media stream to caller to avoid tone changes between policy routing and b-leg connection",
                    "render": false
                },
                "nextId": {
                    "type": "string",
                    "pattern": "^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$",
                    "required": true,
                    "description": "Next item to connect to",
                    "render": false
                }
            }
        }
    },


    {
        "id": 49,
        "parentId": 7,
        "templateClass": "ModConnect_Queue",
        "name": "Call Queue",
        "type": "CALL",
        "description": "Call Queue",
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": true,
        "jsonSchema": {
            "type": "object",
            "properties": {
                "ringTargets": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "groupId": {
                                "type": "integer",
                                "description": "Which group of agents to route to",
                                "minimum": 0,
                                "required": true
                            },
                            "distribution": {
                                "type": "object",
                                "description": "The algorithm used to distribute calls to the agents",
                                "oneOf": [{
                                    "type": "object",
                                    "properties": {
                                        "algorithm": {
                                            "type": "string",
                                            "enum": ["LONGEST_IDLE", "SEQUENTIAL"],
                                            "required": true
                                        }
                                    },
                                    "additionalProperties": false
                                },{
                                    "type": "object",
                                    "properties": {
                                        "algorithm": {
                                            "type": "string",
                                            "enum": ["LEAST_TALK", "LEAST_CALLS"],
                                            "required": true
                                        },
                                        "resetDays": {
                                            "type": "array",
                                            "description": "Which days call distribution statistics should be cleared in the organisation's local time (0 = Sunday)",
                                            "items": {
                                                "type": "integer",
                                                "minimum": 0,
                                                "maximum": 6,
                                                "uniqueItems": true
                                            },
                                            "required": true
                                        },
                                        "resetHours": {
                                            "type": "array",
                                            "description": "Which hours call distribution statistics should be cleared in the organisation's local time",
                                            "items": {
                                                "type": "integer",
                                                "minimum": 0,
                                                "maximum": 23,
                                                "uniqueItems": true
                                            },
                                            "required": true
                                        }
                                    },
                                    "additionalProperties": false
                                }],
                                "required": true
                            },
                            "wrapUpTime": {
                                "type": "integer",
                                "description": "How long (in seconds) to wait after a successful call before reusing an agent",
                                "minimum": 0,
                                "required": true
                            },
                            "wrapUpFailedTime": {
                                "type": "integer",
                                "description": "How long (in seconds) to wait after a failed call before reusing an agent",
                                "minimum": 0,
                                "required": true
                            },
                            "ringTime": {
                                "type": "integer",
                                "description": "How long (in seconds) to dial an agent for",
                                "minimum": 0,
                                "required": true
                            },
                            "screenCaller": {
                                "type": "boolean",
                                "description": "Whether call screening is enabled",
                                "required": true
                            },
                            "callWaiting": {
                                "type": "boolean",
                                "description": "Whether call waiting is enabled",
                                "required": true
                            },
                            "skills":{
                                "type":"object",
                                "oneOf":[
                                    {
                                        "properties":{
                                            "enabled":{
                                                "type":"boolean",
                                                "enum":[
                                                    false
                                                ],
                                                "required":true
                                            }
                                        },
                                        "additionalProperties":false
                                    },
                                    {
                                        "properties":{
                                            "enabled":{
                                                "type":"boolean",
                                                "enum":[
                                                    true
                                                ],
                                                "required":true
                                            },
                                            "mode":{
                                                "type":"string",
                                                "enum":[
                                                    "BUILT_IN"
                                                ],
                                                "required":true
                                            },
                                            "parameters":{
                                                "type":"object",
                                                "properties":{
                                                    "agentsRequireAllSkills":{
                                                        "type":"boolean",
                                                        "required":true
                                                    },
                                                    "ignoreUnskilledAgents":{
                                                        "type":"boolean",
                                                        "required":true
                                                    },
                                                    "unskilledAgentsDeferTime":{
                                                        "type":"integer",
                                                        "minimum":0,
                                                        "maximum":86400,
                                                        "required":true
                                                    },
                                                    "algorithm":{
                                                        "type":"string",
                                                        "enum":[
                                                            "SUM",
                                                            "AVERAGE",
                                                            "MAXIMUM"
                                                        ],
                                                        "required":true
                                                    }
                                                },
                                                "additionalProperties":false,
                                                "required":true
                                            }
                                        },
                                        "additionalProperties":false
                                    },
                                    {
                                        "properties":{
                                            "enabled":{
                                                "type":"boolean",
                                                "enum":[
                                                    true
                                                ],
                                                "required":true
                                            },
                                            "mode":{
                                                "type":"string",
                                                "enum":[
                                                    "HOOK"
                                                ],
                                                "required":true
                                            },
                                            "hook":{
                                                "type":"string",
                                                "pattern":"^[A-Za-z0-9\\-_]+$",
                                                "minLength":1,
                                                "maxLength":128,
                                                "required":true
                                            }
                                        },
                                        "additionalProperties":false
                                    }
                                ],
                                "required":false
                            }
                        },
                        "additionalProperties": false
                    },
                    "minimum": 1,
                    "required": true,
                    "additionalItems": false,
                    "description": "The agent groups to dial",
                    "default": []
                },
                "holdMusic": {
                    "oneOf": [
                        {
                            "properties": {
                                "type": {
                                    "type": "string",
                                    "enum": ["AUTO"],
                                    "required": true
                                }
                            }
                        },
                        {
                            "properties": {
                                "type": {
                                    "type": "string",
                                    "enum": ["PRESET"],
                                    "required": true
                                },
                                "preset": {
                                    "description": "The name of the preset hold music",
                                    "type": {
                                        "type": "string",
                                        "enum": [
                                            "AFRICAN",
                                            "BLUES",
                                            "CLASSICAL",
                                            "DISCO",
                                            "FOLK",
                                            "FUNKY",
                                            "JAZZ",
                                            "MODERN"
                                        ]
                                    }
                                }
                            },
                            "additionalProperties": false
                        },
                        {
                            "properties": {
                                "type": {
                                    "type": "string",
                                    "enum": ["CUSTOM"],
                                    "required": true
                                },
                                "url": {
                                    "description": "URL of the custom hold music",
                                    "type": "string",
                                    "format": "uri",
                                    "pattern": "^shout://.+",
                                    "maxLength": 255,
                                    "required": true
                                }
                            },
                            "additionalProperties": false
                        }
                    ],
                    "type": "object",
                    "required": false,
                    "description": "What hold music to play, or AUTO for the organisation's default"
                },
                "callerIdName": {
                    "type": [
                        "string",
                        "null"
                    ],
                    "minLength": 1,
                    "required": false,
                    "default": null,
                    "description": "Override the Caller ID name"
                },
                "announcements": {
                    "type": "array",
                    "items": {
                        "oneOf": [
                            {
                                "properties": {
                                    "type": {
                                        "enum": [
                                            "SOUND"
                                        ],
                                        "required": true
                                    },
                                    "soundId": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "required": true
                                    }
                                }
                            },
                            {
                                "properties": {
                                    "type": {
                                        "enum": [
                                            "TTS"
                                        ],
                                        "required": true
                                    },
                                    "text": {
                                        "type": "string",
                                        "required": true
                                    }
                                }
                            }
                        ],
                        "type": "object"
                    },
                    "required": false,
                    "description": "What TTS or sound announcements should be played to the caller periodically",
                    "default":[]
                },
                "announcePeriod": {
                    "type": "integer",
                    "minimum": 0,
                    "required": false,
                    "default": 60,
                    "description": "How often (in seconds) to announce to the caller"
                },
                "maxCalls": {
                    "type": "integer",
                    "minimum": 0,
                    "required": false,
                    "default": 100,
                    "description": "Maximum calls this call queue should support"
                },
                "maxTime": {
                    "type": "integer",
                    "minimum": 0,
                    "required": false,
                    "default": 30,
                    "description": "Maximum time (in minutes) a caller can sit in a call queue"
                },
                "exitKey": {
                    "type": [
                        "string",
                        "null"
                    ],
                    "enum": [
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                        "0",
                        "*",
                        "#",
                        null
                    ],
                    "required": false,
                    "default": null,
                    "description": "Key to exit the queue. Any digit from 0 to 9, * or #, or null to disable"
                },
                "solidCallThreshold": {
                    "type": "integer",
                    "minimum": 0,
                    "required": false,
                    "default": 120,
                    "description": "How long (in seconds) until an answered call is considered 'solid'"
                },
                "nextId": {
                    "type": "string",
                    "pattern": "^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$",
                    "required": true,
                    "description": "Next item to connect to if this call queue connects"
                }
            },
            "additionalProperties": false
        }
    },

    {
        "id": 16,
        "parentId": 1,
        "templateClass": "ModNumber_PublicCatchAll",
        "name": "Catch All",
        "type": "CALL",
        "description": "Public numbers owned by the Org that can be dialled from the external telephone network, but have no other policies assigned to them",
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": false,
        "jsonSchema": {
            "type": "object",
            "additionalProperties": false,
            "hideConfig": true,
            "properties": {
                "delayBeforeAnswering": {
                    "type": "integer",
                    "minimum": 0,
                    "required": false,
                    "default": 0,
                    "description": "How many ring tones must be sent to the caller before the call is answered",
                    "render": false
                },
                "ringtone": {
                    "type": "string",
                    "enum": [
                        "UK",
                        "AU",
                        "IN",
                        "TH",
                        "US",
                        "FR",
                        "BONG",
                        "AUTO"
                    ],
                    "required": false,
                    "default": "AUTO",
                    "description": "The ringtone that will be played to the caller",
                    "render": false
                },
                "callerIdName": {
                    "type": [
                        "string",
                        "null"
                    ],
                    "pattern": "^[A-Za-z0-9_\\- ]+$",
                    "minLength": 1,
                    "required": false,
                    "default": null,
                    "description": "Override the Caller ID name",
                    "render": false
                },
                "nextId": {
                    "type": "string",
                    "pattern": "^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$",
                    "required": true,
                    "description": "Next item to connect to",
                    "render": false
                }
            }
        }
    },

    {
        "id": 31,
        "parentId": 1,
        "templateClass": "ModNumber_Internal",
        "name": "Extension",
        "type": "CALL",
        "description": "An internal extension that can be dialled",
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": false,
        "jsonSchema": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "delayBeforeAnswering": {
                    "type": "integer",
                    "minimum": 0,
                    "required": false,
                    "default": 0,
                    "description": "How many ring tones must be sent to the caller before the call is answered",
                    "render": false

                },
                "numberType": {
                    "type": "string",
                    "enum": [
                        "NUMBER",
                        "REGEX",
                    ],
                    "required": false,
                    "default": "NUMBER",
                    "description": "Criteria for Hooking Internal Numbers",
                    "render": "select"


                },
                "internalExtension": {
                    "type": "string",
                    "minLength": 1,
                    "required": true,
                    "description": "Extension to Hook"
                },
                "ringtone": {
                    "type": "string",
                    "enum": [
                        "UK",
                        "US",
                        "FR",
                        "BONG"
                    ],
                    "required": false,
                    "default": "UK",
                    "description": "The ringtone that will be played to the caller",
                    "render": false
                },
                "callerIdName": {
                    "type": [
                        "string",
                        "null"
                    ],
                    "pattern": "^[A-Za-z0-9_\\- ]+$",
                    "minLength": 1,
                    "required": false,
                    "default": null,
                    "description": "Override the Caller ID name",
                    "render": false
                },
                "nextId": {
                    "type": "string",
                    "pattern": "^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$",
                    "required": true,
                    "description": "Link if this number is dialled",
                    "render": false

                }
            }
        }
    },


    {
        "id": 81,
        "parentId": 1,
        "templateClass": "ModNumber_FromSIPTrunk",
        "name": "From SIP Trunk",
        "type": "CALL",
        "description": "Calls from a PBX via a SIP Trunk",
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": false,
        "jsonSchema": {
            "type": "object",
            "additionalProperties": false,
            "hideConfig": true,
            "showInfo": "Warning: This component will hook ALL outbound SIP Trunk calls.\nPlease ensure the policy is accurately configured before enabling.\nOnly one item of this type can be used across all Routing Policies.",
            "properties": {
                "nextId": {
                    "type": "string",
                    "pattern": "^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$",
                    "required": true,
                    "description": "Next item to connect to",
                    "render":false
                }
            }
        }
    },

    {
        "id": 4,
        "parentId": null,
        "templateClass": "ModAction",
        "name": "Action",
        "type": "CALL",
        "description": "A module allowing you to perform one or more actions on the call flow",
        "inputConnectorsAllowed": true,
        "outputConnectorsAllowed": true,
        "jsonSchema": {
            "type": "object",
            "additionalProperties": false,
            "hideConfig": true,
            "properties": {
                "nextId": {
                    "type": "integer",
                    "minimum": 0,
                    "required": true,
                    "description": "Next item to connect this module to",
                    "render": false,
                }
            }
        }
    },
    {
        "id": 5,
        "parentId": 4,
        "templateClass": "ModAction_Say",
        "name": "Speech",
        "type": "CALL",
        "description": "Enables you to say a phrase to the caller or called party",
        "inputConnectorsAllowed": true,
        "outputConnectorsAllowed": true,
        "defaultStart": false,
        "jsonSchema": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "voice": {
                    "type": "string",
                    "enum": [
                        "AUTO",
                        "DA-DK_ANNA_AI",
                        "DA-DK_MADS",
                        "DA-DK_NAJA",
                        "NL-NL_FLEUR_AI",
                        "NL_LOTTE",
                        "NL-NL_RUBEN",
                        "NL_SASKIA",
                        "NL_WILLEM",
                        "EN-AU_AMELIA_AI",
                        "EN_NICOLE",
                        "EN-AU_NOAH_AI",
                        "EN-AU_OLIVIA_AI",
                        "EN_RUSSELL",
                        "EN-AU_WILLIAM_AI",
                        "EN-GB_AMY",
                        "EN-GB_BRIAN",
                        "EN_EMMA",
                        "EN-GB_HANNAH_AI",
                        "EN_KATE",
                        "EN-GB_LEWIS_AI",
                        "EN-GB_LUCY_AI",
                        "EN_SIMON",
                        "EN-GB_THOMAS_AI",
                        "EN-IN_ADITI",
                        "EN-IN_RAVEENA",
                        "EN_CHIPMUNK",
                        "EN-US_EMILY_AI",
                        "EN_ERIC",
                        "EN-US_EVELYN_AI",
                        "EN_IVY",
                        "EN_JENNIFER",
                        "EN-US_JOANNA",
                        "EN_JOEY",
                        "EN-US_JUSTIN",
                        "EN_KENDRA",
                        "EN_KIMBERLY",
                        "EN-US_LIAM_AI",
                        "EN-US_MATTHEW",
                        "EN-US_MICHAEL_AI",
                        "EN-US_OLIVER_AI",
                        "EN_SALLI",
                        "EN-US_SOPHIA_AI",
                        "FR_CA_CHANTAL",
                        "FR-CA_FELIX_AI",
                        "FR-CA_FLORENCE_AI",
                        "FR-CA_JULIETTE_AI",
                        "FR-CA_RAPHAEL_AI",
                        "FR-FR_ADELE_AI",
                        "FR_CELINE",
                        "FR-FR_CURTIS_AI",
                        "FR-FR_DANIELLE_AI",
                        "FR-FR_JASPER_AI",
                        "FR-FR_LEA",
                        "FR_MATHIEU",
                        "DE-DE_ELIAS_AI",
                        "DE-DE_ERIKA_AI",
                        "DE_HANS",
                        "DE-DE_LEONIE_AI",
                        "DE_MARLENE",
                        "DE-DE_MARTINA_AI",
                        "DE-DE_OSKAR_AI",
                        "DE-DE_VICKI",
                        "HI-IN_ADITI",
                        "IS_DORA",
                        "IS_KARL",
                        "IT-IT_BIANCA",
                        "IT_CARLA",
                        "IT_GIORGIO",
                        "JA-JP_KANNA_AI",
                        "JA-JP_MIZUKI",
                        "JA-JP_TAKUMI",
                        "KO-KR_HYUN_AI",
                        "KO-KR_JI-SU_AI",
                        "KO-KR_KWAN_AI",
                        "KO-KR_SEO-YUN_AI",
                        "KO-KR_SEOYEON",
                        "CMN-CN_ZHIYU",
                        "NB-NO_ANITA_AI",
                        "NB_NO_LIV",
                        "PL_AGNIESZKA",
                        "PL-PL_ANTONI_AI",
                        "PL-PL_DOMINIK_AI",
                        "PL-PL_ELENA_AI",
                        "PL_EWA",
                        "PL-PL_IGA_AI",
                        "PL_JACEK",
                        "PL_JAN",
                        "PL_MAJA",
                        "PL-PL_MONIKA_AI",
                        "PT_BR_RICARDO",
                        "PT_BR_VITORIA",
                        "PT-BR_IZABEL_AI",
                        "PT-PT_ADRIANO_AI",
                        "PT-PT_CRISTIANO",
                        "PT-PT_INES",
                        "PT-PT_JERONIMO_AI",
                        "PT-PT_MARISSA_AI",
                        "PT-PT_ROSA_AI",
                        "RO_CARMEN",
                        "RU-RU_GENNADI_AI",
                        "RU-RU_IVAN_AI",
                        "RU-RU_MAXIM",
                        "RU-RU_NATASHA_AI",
                        "RU-RU_TANYA_AI",
                        "RU_TATYANA",
                        "SK-SK_NINA_AI",
                        "ES_CONCHITA",
                        "ES_ENRIQUE",
                        "ES-ES_LUCIA",
                        "ES-ES_VALERIA_AI",
                        "ES-MX_MIA",
                        "ES_US_MIGUEL",
                        "ES-US_PENELOPE",
                        "SV_SE_ASTRID",
                        "SV-SE_ELSA_AI",
                        "TR-TR_AYLA_AI",
                        "TR_FILIZ",
                        "TR-TR_NESRIN_AI",
                        "TR-TR_OMER_AI",
                        "TR-TR_YESIM_AI",
                        "TR-TR_YUSEF_AI",
                        "UK-UA_LIZA_AI",
                        "CY_GERAINT",
                        "CY_GWYNETH"
                    ],
                    "required": false,
                    "default": "EN-GB_AMY",
                    "description": "The voice from the known repertoire",
                    "render": "select"
                },
                "sayPhrase": {
                    "type": "string",
                    "required": true,
                    "description": "The phrase you want to say",
                    "render": "textarea",
                    "rows": 6,
                    "sound": true,
                    "macro": true
                }
            }
        }
    },
    {
        "id": 9,
        "parentId": null,
        "templateClass": "ModSwitchBoard",
        "name": "Switchboard",
        "type": "CALL",
        "description": "Enables you to route calls based on user selecting from options",
        "inputConnectorsAllowed": true,
        "outputConnectorsAllowed": true,
        "defaultStart": false,
        "jsonSchema": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "welcomePhraseBegin": {
                    "type": "string",
                    "required": false,
                    "default": "Welcome to this switchboard. Please press:",
                    "description": "A phrase to say when the Switch Board feature is activated, and before any switchboard element phrases are said",
                    "render": "textarea",
                    "rows": "2",
                    "macro": true,
                    "sound": true
                },
                "welcomePhraseEnd": {
                    "type": "string",
                    "required": false,
                    "default": "Press 9 to hear these options again.",
                    "description": "A phrase to say when the Switch Board feature is activated, and after any switchboard phrases have been said",
                    "render": "textarea",
                    "macro": true,
                    "sound": true
                },
                "badInputPhrase": {
                    "type": "string",
                    "required": false,
                    "default": "I don't recognise that option. Please try again.",
                    "description": "A phrase to say when the user makes a mistake or makes no input",
                    "render": "textarea",
                    "rows": "2",
                    "macro": true,
                    "sound": true
                },
                "attempts": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 99,
                    "required": false,
                    "default": 3,
                    "description": "How many attempts to allow the user to input a valid sequence",
                    "render": 'number'
                },
                "attemptTimeout": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 99,
                    "required": false,
                    "default": 7,
                    "description": "Seconds to wait for an input before asking again",
                    "render": "number",
                    "macro": false
                },
                "repeatWelcomeOnTimeout": {
                    "type": "boolean",
                    "required": false,
                    "default": false,
                    "description": "Repeat the welcome phrase again if this switchboard times out or the user presses the wrong key",
                    "render": "checkbox"
                },
                "hearAgainTone": {
                    "type": [
                        "string",
                        "null"
                    ],
                    "enum": [
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                        "0"
                    ],
                    "required": false,
                    "default": "9",
                    "description": "Dial tone key to press, if you want to allow user to hear this messsage again",
                    "render": "select"

                },
                "nextId": {
                    "type": "integer",
                    "minimum": 0,
                    "required": true,
                    "description": "Next item to connect this module to if caller makes too many invalid key presses or a timeout occurs",
                    "render": false,
                }
            }
        }
    },
    {
        "id": 10,
        "parentId": 9,
        "templateClass": "ModSwitchBoard_SwitchItem",
        "name": "Switch Item",
        "type": "CALL",
        "description": "Enables you to route calls based on user selecting from options",
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": true,
        "defaultStart": false,
        "jsonSchema": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "itemPhrase": {
                    "type": [
                        "string",
                        "null"
                    ],
                    "minLength": 1,
                    "required": false,
                    "default": null,
                    "description": "Speak a phrase to identify this item",
                    "render": "textarea",
                    "rows": 2,
                    "sound": true,
                    "macro": true
                },
                "tone": {
                    "type": "string",
                    "enum": [
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                        "0",
                        "*",
                        "#"
                    ],
                    "required": true,
                    "default": "1",
                    "description": "A key tone to listen for. Any digit from 0 to 9, * or #",
                    "render": "select"
                },
                "pattern": {
                    "type": [
                        "string",
                        "null"
                    ],
                    "pattern": "^\\d+$",
                    "minLength": 1,
                    "required": false,
                    "default": null,
                    "description": "A digit pattern to look for, to assign to a variable"
                },
                "patternAssignTo": {
                    "type": "string",
                    "enum": [
                        "VAR_DIALLED_NUMBER",
                        "RM_DIALLED_NUMBER",
                        "VAR_PIN_NUMBER"
                    ],
                    "required": false,
                    "default": "VAR_DIALLED_NUMBER",
                    "description": "A variable to assign the pattern to",
                    "render": "select"
                },
                "selectedPhrase": {
                    "type": [
                        "string",
                        "null"
                    ],
                    "minLength": 1,
                    "required": false,
                    "default": null,
                    "description": "A phrase to say when this item is selected",
                    "render": "textarea",
                    "rows": 2,
                    "sound": true,
                    "macro": true

                },
                "callerIdName": {
                    "type": [
                        "string",
                        "null"
                    ],
                    "minLength": 1,
                    "required": false,
                    "default": null,
                    "description": "Override the Caller ID name",
                    "macro": true
                },
                "nextId": {
                    "type": "integer",
                    "minimum": 0,
                    "required": true,
                    "description": "Next item to connect this module to when a valid key press is detected",
                    "render": false,
                }
            }
        }
    },

    {
        "id": 34,
        "parentId": 9,
        "templateClass": "ModSwitchBoard_ItemGetInfo",
        "name": "Switch Info",
        "type": "CALL",
        "description": "Gets information from user",
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": true,
        "defaultStart": false,
        "jsonSchema": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "itemPhrase": {
                    "type": [
                        "string",
                        "null"
                    ],
                    "minLength": 1,
                    "required": false,
                    "default": null,
                    "description": "Speak a phrase to identify this item",
                    "render": "textarea",
                    "rows": 2,
                    "sound": true,
                    "macro": true
                },
                "tone": {
                    "type": "string",
                    "enum": [
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                        "0",
                        "*",
                        "#"
                    ],
                    "required": true,
                    "default": "1",
                    "description": "A key tone to listen for. Any digit from 0 to 9, * or #",
                    "render": "select"
                },
                "pattern": {
                    "type": [
                        "string",
                        "null"
                    ],
                    "pattern": "^\\d+$",
                    "minLength": 1,
                    "required": false,
                    "default": null,
                    "description": "A digit pattern to look for, to assign to a variable"
                },
                "patternAssignTo": {
                    "type": "string",
                    "enum": [
                        "VAR_DIALLED_NUMBER",
                        "RM_DIALLED_NUMBER"
                    ],
                    "required": false,
                    "default": "RM_DIALLED_NUMBER",
                    "description": "A variable to assign the pattern to",
                    "render": "select"
                },
                "patternAssignType": {
                    "type": "string",
                    "enum": [
                        "BUILTIN",
                        "MACRO"
                    ],
                    "required": false,
                    "default": "BUILTIN",
                    "description": "Type of macro assignment",
                    "render": "select"
                },
                "patternAssignMacro": {
                    "type": [
                        "string",
                        "null"
                    ],
                    "minLength": 1,
                    "required": false,
                    "default": null,
                    "description": "Assign a value to a custom macro",
                    "directive" : "result-set-name"
                },
                "selectedPhrase": {
                    "type": [
                        "string",
                        "null"
                    ],
                    "minLength": 1,
                    "required": false,
                    "default": null,
                    "description": "A phrase to say when this item is selected",
                    "render": "textarea",
                    "rows": 2,
                    "sound": true,
                    "macro": true
                },
                "callerIdName": {
                    "type": [
                        "string",
                        "null"
                    ],
                    "minLength": 1,
                    "required": false,
                    "default": null,
                    "description": "Override the Caller ID name",
                    "macro": true
                },
                "nextId": {
                    "type": "integer",
                    "minimum": 0,
                    "required": true,
                    "description": "Next item to connect this module to when a valid key press is detected",
                    "render": false
                }
            }
        }

    },

    //ModAction_Record
    {
        "id": 6,
        "parentId": 4,
        "templateClass": "ModAction_Record",
        "name": "Record a call",
        "type": "CALL",
        "description": "Enables you to start recording the call",
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": false,
        "defaultStart": false,
        "jsonSchema": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
               "channel": {
                    "type": "string",
                    "enum": [
                        "A",
                        "B"
                    ],
                    "required": false,
                    "default": "A",
                    "description": "Leg to apply recording to",
                    "render": "select"
                },
                "emailSend": {
                    "type": "boolean",
                    "required": false,
                    "default": false,
                    "description": "Whether to email the recordings",
                    "render": "checkbox"
                },
                "emailToAddresses": {
                    "type": [
                        "array",
                        "null"
                    ],
                    "items": {
                        "type": "string"
                    },
                    "required": false,
                    "default": null,
                    "description": "Send the recording to these email addresses",

                },
                "emailCcAddresses": {
                    "type": [
                        "array",
                        "null"
                    ],
                    "items": {
                        "type": "string"
                    },
                    "required": false,
                    "default": null,
                    "description": "Send the recording to these email addresses"
                },
                "emailSubject": {
                    "type": "string",
                    "required": false,
                    "default": "Your email recording",
                    "description": "The subject of the email"
                },
                "reset": {
                    "type": "boolean",
                    "required": false,
                    "default": true,
                    "description": "Whether or not to retain existing recording settings",
                    "render": "checkbox"
                },
                "retain": {
                    "type": "boolean",
                    "required": false,
                    "default": true,
                    "description": "Whether or not to keep the recording in the service logs",
                    "render": "checkbox"
                },
                "startOnBridge": {
                    "type": "boolean",
                    "required": false,
                    "default": true,
                    "description": "Start the call recording only when the call is connected, otherwise it starts now",
                    "render": "checkbox"
                },
                "archivePolicyId": {
                    "type":[
                        "integer",
                        "null"
                    ],
                    "minimum": 1,
                    "required": true,
                    "description": "The Archive Policy to associate with this call recording, null for default. Has no effect if retain is set to false"
                },
                "beep": {
                    "type": "string",
                    "enum": [
                        "OFF",
                        "CALLED",
                        "CALLER",
                        "BOTH"
                    ],
                    "required": false,
                    "default": "OFF",
                    "description": "Plays a beep every 15 seconds to make the parties aware that call recording is on",
                    "render": "select"
                },
                "toneStream": {
                    "type": [
                        "string",
                        "null"
                    ],
                    "pattern": "^[A-Za-z0-9\\*\\=\\+\\%\\;\\<\\>\\.\\,\\(\\) -]*$",
                    "minLength": 1,
                    "required": false,
                    "default": null,
                    "description": "Custom Beep TGML string. Leave blank to use default beep tone"
                },
                "allowPause": {
                    "type": "boolean",
                    "required": false,
                    "default": false,
                    "description": "Allow users to pause the recording with star codes",
                    "render": "checkbox"
                }

            }
        }
    },

    
    {
        "id": 47,
        "parentId": 4,
        "templateClass": "ModAction_NotifyEmail",
        "name": "Send Email",
        "type": "CALL",
        "description": "Send Email",
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": false,
        "defaultStart": false,
        "jsonSchema" : {
            "definitions": {
                "macro": { "pattern": "^\\$\\([A-Za-z0-9\\-_\\.:]+\\)$" },
                "macroOrEmail" : {
                    "oneOf": [
                        { "$ref": "#/definitions/macro" },
                        { "format": "email" }
                    ],
                    "type": "string",
                    "minLength": 1
                }
            },
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "toAddresses": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/macroOrEmail"
                    },
                    "minItems": 1,
                    "uniqueItems": true,
                    "required": true,
                    "description": "To email addresses"
                },
                "ccAddresses": {
                    "type": ["array", "null"],
                    "items": {
                        "$ref": "#/definitions/macroOrEmail"
                    },
                    "minItems": 1,
                    "uniqueItems": true,
                    "required": false,
                    "default": null,
                    "description": "Cc email addresses"
                },
                "subject": {
                    "type": "string",
                    "minLength": 1,
                    "required": true,
                    "description": "Email subject"
                },
                "text": {
                    "type": "string",
                    "required": false,
                    "default": "A telephone call has been made",
                    "description": "Email body"
                },
                "sendNow": {
                    "type": "boolean",
                    "required": false,
                    "default": true,
                    "description": "Send the email notification now or when the call ends"
                }
            }
        }

    },

    {
        "id": 28,
        "parentId": 4,
        "templateClass": "ModAction_NotifySMS",
        "name": "Send SMS",
        "type": "CALL",
        "description": "Send SMS",
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": false,
        "defaultStart": false,
        "jsonSchema" : {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "toNumber": {
                    "type": "string",
                    "required": true,
                    "description": "The number to send an SMS to"
                },
                "fromNumber": {
                    "type": "string",
                    "required": true,
                    "description": "The sender number"
                },
                "text": {
                    "type": "string",
                    "required": true,
                    "description": "The SMS message to send"
                },
                "sendNow": {
                    "type": "boolean",
                    "required": false,
                    "default": true,
                    "description": "Send the SMS notification now or when the call ends"
                }
            }
        }
    },

    //ModFinish
    {
        "id": 23,
        "parentId": null,
        "templateClass": "ModFinish",
        "name": "Finish",
        "type": "CALL",
        "description": "A set of components that allow you to finish your dial plan",
        "inputConnectorsAllowed": true,
        "outputConnectorsAllowed": false,
        "defaultStart": false,
        "jsonSchema": {
            "type": "object",
            "additionalProperties": false,
            "properties": {},
            "hideConfig": true
        }
    },
    {
        "id": 24,
        "parentId": 13,
        "templateClass": "ModFinish_VoiceMail",
        "name": "Voice Mail",
        "type": "CALL",
        "description": "Sends a call to a voice mail box before hanging up",
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": false,
        "defaultStart": false,
        "jsonSchema": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "mailbox": {
                    "type": "object",
                    "description": "Defines the mailbox, either for a user or group",
                    "additionalProperties": false,
                    "default": {"type": "DDI_USER"},
                    "oneOf": [{
                        "type": "object",
                        "additionalProperties": false,
                        "properties": {
                            "type": {
                                "enum": [
                                    "USER"
                                ],
                                "required": true
                            },
                            "userId": {
                                "type": "integer",
                                "minimum": 1,
                                "required": true
                            }
                        }
                    }, {
                        "type": "object",
                        "additionalProperties": false,
                        "properties": {
                            "type": {
                                "enum": [
                                    "GROUP"
                                ],
                                "required": true
                            },
                            "groupId": {
                                "type": "integer",
                                "minimum": 1,
                                "required": true
                            }
                        }
                    }, {
                        "type": "object",
                        "additionalProperties": false,
                        "properties": {
                            "type": {
                                "enum": [
                                    "DDI_USER"
                                ],
                                "required": true
                            }
                        }
                    }]
                },
                "disableInstructions": {
                    "type": "boolean",
                    "required": false,
                    "default": false,
                    "description": "Disable recording instructions"
                },
                "greeting": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": false,
                    "default": {"enabled": false, "phrase": null},
                    "description": "An optional greeting that can be played to the caller before the instructions",
                    "properties": {
                        "enabled": {
                            "type": "boolean",
                            "required": true
                        },
                        "phrase": {
                            "type": [
                                "string",
                                "null"
                            ],
                            "minLength": 1,
                            "required": false,
                            "default": null,
                            "description": "Phrase to play to the caller"
                        }
                    }
                },
                "emailSettings": {
                    "type": [
                        "object",
                        "null"
                    ],
                    "additionalProperties": false,
                    "required": false,
                    "properties": {
                        "sendTo": {
                            "type": "object",
                            "required": false,
                            "oneOf": [{
                                "type": "object",
                                "additionalProperties": false,
                                "properties": {
                                    "behaviour": {
                                        "enum": [
                                            "SPECIFIED"
                                        ],
                                        "required": true
                                    },
                                    "toAddresses": {
                                        "type": "array",
                                        "items": {
                                            "type": "string"
                                        },
                                        "minItems": 1,
                                        "required": true,
                                        "uniqueItems": true
                                    }
                                }
                            }, {
                                "type": "object",
                                "additionalProperties": false,
                                "properties": {
                                    "behaviour": {
                                        "enum": [
                                            "DEFAULT_AND_SPECIFIED"
                                        ],
                                        "required": true
                                    },
                                    "toAddresses": {
                                        "type": "array",
                                        "items": {
                                            "type": "string"
                                        },
                                        "minItems": 1,
                                        "required": true,
                                        "uniqueItems": true
                                    }
                                }
                            }, {
                                "type": "object",
                                "additionalProperties": false,
                                "properties": {
                                    "behaviour": {
                                        "enum": [
                                            "DEFAULT"
                                        ],
                                        "required": true
                                    }
                                }
                            }]
                        },
                        "attachRecording": {
                            "type": "boolean",
                            "required": false,
                            "default": false,
                            "description": "Attach a recording of the voicemail to the email"
                        },
                        "keepCopy": {
                            "type": "boolean",
                            "required": false,
                            "default": false,
                            "description": "Keep a copy of the voicemail in the mailbox"
                        }
                    }
                },
                "ccSettings": {
                    "type": [
                        "object",
                        "null"
                    ],
                    "additionalProperties": false,
                    "required": false,
                    "oneOf": [{
                        "type": "object",
                        "additionalProperties": false,
                        "properties": {
                            "behaviour": {
                                "enum": [
                                    "SPECIFIED"
                                ],
                                "required": true
                            },
                            "userIds": {
                                "type": "array",
                                "items": {
                                    "type": "integer"
                                },
                                "minItems": 1,
                                "required": true,
                                "uniqueItems": true
                            }
                        }
                    }, {
                        "type": "object",
                        "additionalProperties": false,
                        "properties": {
                            "behaviour": {
                                "enum": [
                                    "DEFAULT_AND_SPECIFIED"
                                ],
                                "required": true
                            },
                            "userIds": {
                                "type": "array",
                                "items": {
                                    "type": "integer"
                                },
                                "minItems": 1,
                                "required": true,
                                "uniqueItems": true
                            }
                        }
                    }, {
                        "type": "object",
                        "additionalProperties": false,
                        "properties": {
                            "behaviour": {
                                "enum": [
                                    "DEFAULT"
                                ],
                                "required": true
                            }
                        }
                    }, {
                        "type": "null"
                    }]
                }
            }
        }
    },

    //non call

    {
        "id": 92,
        "parentId": null,
        "templateClass": "ModStartNC",
        "name": "Start",
        "type": "NON_CALL",
        "description": "Start",
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": true,
        "defaultStart": false,
        "jsonSchema": {
            "type": "object",
            "additionalProperties": false,
            "properties": {},
            "hideConfig": true,
        }
    },
    {
        "id": 127,
        "parentId": 92,
        "templateClass": "ModStartNC_CallCommon",
        "name": "Call Common",
        "type": "NON_CALL",
        "description": "Common non call policy to run in conjunction with all Call policies",
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": true,
        "defaultStart": false,
        "jsonSchema": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "emailTechSupportOnError": {
                    "type": "boolean",
                    "required": false,
                    "default": true,
                    "description": "Send emails to support for debug when errors occur",
                    "render": "checkbox"
                },
                "nextId": {
                    "type": "string",
                    "pattern": "^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$",
                    "required": true,
                    "description": "Next item to connect this module to",
                    "render": false
                }
            }
        }
    },

    {
        "id": 94,
        "parentId": null,
        "templateClass": "ModActionNC",
        "name": "Action",
        "type": "NON_CALL",
        "description": "A module allowing you to perform one or more actions on the call flow",
        "inputConnectorsAllowed": true,
        "outputConnectorsAllowed": true,
        "jsonSchema": {
            "type": "object",
            "additionalProperties": false,
            "hideConfig": true,
            "properties": {
                "nextId": {
                    "type": "integer",
                    "minimum": 0,
                    "required": true,
                    "description": "Next item to connect this module to",
                    "render": false,
                }
            }
        }
    },

    {
        "id": 95,
        "parentId": 94,
        "templateClass": "ModActionNC_Debug",
        "name": "Debug",
        "type": "NON_CALL",
        "description": "Debug",
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": false,
        "jsonSchema": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "emailAddress": {
                    "type": [
                        "string",
                        "null"
                    ],
                    "format": "email",
                    "required": true,
                    "default": null,
                    "description": "Email address to notify",
                    "macro": true
                },
                "notifyLevel": {
                    "type": "string",
                    "enum": [
                        "NONE",
                        "ERROR",
                        "ALL"
                    ],
                    "required": false,
                    "default": "ERROR",
                    "description": "Notify level",
                    "render": "select"
                },
                "forceDebugLevel": {
                    "type": "boolean",
                    "required": true,
                    "default": false,
                    "description": "Force this debug level, otherwise use highest current level setting",
                    "render": "checkbox"
                },
                "alertOnEveryRetry": {
                    "type": "boolean",
                    "required": false,
                    "default": false,
                    "description": "Alert on every retry, or alert only once on the first failure",
                    "render": "checkbox"
                },
                "macros": {
                    "type": [
                        "array",
                        "null"
                    ],
                    "items": {
                        "type": "string",
                        "minLength": 1
                    },
                    "required": false,
                    "default": null,
                    "description": "Macros that you wish to report on",
                }

            }
        }
    },

    {
        "id": 98,
        "parentId": 94,
        "templateClass": "ModActionNC_NotifyEmail",
        "name": "Send Email",
        "type": "CALL",
        "description": "Send Email",
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": false,
        "defaultStart": false,
        "jsonSchema" : {
            "definitions": {
                "macro": { "pattern": "^\\$\\([A-Za-z0-9\\-_\\.:]+\\)$" },
                "macroOrEmail" : {
                    "oneOf": [
                        { "$ref": "#/definitions/macro" },
                        { "format": "email" }
                    ],
                    "type": "string",
                    "minLength": 1
                }
            },
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "toAddresses": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/macroOrEmail"
                    },
                    "minItems": 1,
                    "uniqueItems": true,
                    "required": true,
                    "description": "To email addresses"
                },
                "ccAddresses": {
                    "type": ["array", "null"],
                    "items": {
                        "$ref": "#/definitions/macroOrEmail"
                    },
                    "minItems": 1,
                    "uniqueItems": true,
                    "required": false,
                    "default": null,
                    "description": "Cc email addresses"
                },
                "subject": {
                    "type": "string",
                    "minLength": 1,
                    "required": true,
                    "description": "Email subject"
                },
                "text": {
                    "type": "string",
                    "required": false,
                    "default": "A telephone call has been made",
                    "description": "Email body"
                },
                "whichPolicyAttempt": {
                    "type": "string",
                    "enum": [
                        "FIRST",
                        "ALL",
                        "RETRIES"
                    ],
                    "required": false,
                    "default": "FIRST",
                    "description": "Define when the email should be sent according to the policy retries"
                }
            }
        }

    },

    {
        "id": 99,
        "parentId": 94,
        "templateClass": "ModActionNC_NotifySMS",
        "name": "Send SMS",
        "type": "CALL",
        "description": "Send SMS",
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": false,
        "defaultStart": false,
        "jsonSchema" : {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "toNumber": {
                    "type": "string",
                    "required": true,
                    "description": "The number to send an SMS to"
                },
                "fromNumber": {
                    "type": "string",
                    "required": true,
                    "description": "The sender number"
                },
                "text": {
                    "type": "string",
                    "required": true,
                    "description": "The SMS message to send"
                },
                "whichPolicyAttempt": {
                    "type": "string",
                    "enum": [
                        "FIRST",
                        "ALL",
                        "RETRIES"
                    ],
                    "required": false,
                    "default": "FIRST",
                    "description": "Define when the SMS should be sent according to the policy retries"
                }
            }
        }
    },


    //ModFinishNC
    {
        "id": 23,
        "parentId": null,
        "templateClass": "ModFinishNC",
        "name": "Finish",
        "type": "NON_CALL",
        "description": "A set of components that allow you to finish your dial plan",
        "inputConnectorsAllowed": true,
        "outputConnectorsAllowed": false,
        "defaultStart": false,
        "jsonSchema": {
            "type": "object",
            "additionalProperties": false,
            "properties": {},
            "hideConfig": true
        }
    },
    {
        "id": 66,
        "parentId": null,
        "templateClass": "ModPolicy",
        "name": "Policy",
        "type": "SYSTEM",
        "description": "Policy",
        "inputConnectorsAllowed": true,
        "outputConnectorsAllowed": false,
        "defaultStart": false,
        "jsonSchema": {
            "type": "object",
            "additionalProperties": false,
            "hideConfig": true,
            "properties": {}
        }
    },
    {
        "id": 64,
        "parentId": 66,
        "templateClass": "ModPolicy_ToCall",
        "name": "Policy",
        "type": "SYSTEM",
        "description": "Invoke a Call Policy",
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": false,
        "defaultStart": false,
        "jsonSchema": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "nextPolicyId": {
                    "type": "integer",
                    "minimum": 1,
                    "required": true,
                    "description": "The reference to the next policy to run"
                }
            }
        }
    },
    {
        "id": 65,
        "parentId": 66,
        "templateClass": "ModPolicy_ToNonCall",
        "name": "NON_CALL",
        "type": "SYSTEM",
        "description": "Invoke a Non Call Policy",
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": true,
        "defaultStart": false,
        "jsonSchema": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "nonCallPolicyId": {
                    "type": "integer",
                    "minimum": 1,
                    "required": true,
                    "description": "Select Policy to run when this call completes"
                },
                "nextId": {
                    "type": "integer",
                    "minimum": 0,
                    "required": true,
                    "description": "Next item to connect this module to",
                    "render": false
                }
            }
        }
    },

    {
        "id": 93,
        "parentId": 92,
        "templateClass": "ModStartNC_Trigger",
        "name": "Trigger",
        "type": "NON_CALL",
        "description": "Trigger",
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": true,
        "defaultStart": false,
        "jsonSchema": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "triggerName": {
                    "type": "string",
                    "pattern": "^[A-Z]{1}[A-Za-z0-9_]+$",
                    "required": true,
                    "description": "Trigger name"
                },
                "emailTechSupportOnError": {
                    "type": "boolean",
                    "required": false,
                    "default": true,
                    "description": "Send emails to support for debug when errors occur",
                    "render": "checkbox"
                },
                "nextId": {
                    "type": "string",
                    "pattern": "^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$",
                    "required": true,
                    "description": "Link if this number is dialled",
                    "render": false
                }
            }
        }
    },


    {
        "id": 118,
        "parentId": 117,
        "templateClass": "ModDevelop_Script",
        "name": "Script Engine",
        "type": "CALL",
        "description": "Script Engine",
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": true,
        "defaultStart": false,
        "jsonSchema": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "script": {
                    "type": [
                        "string",
                        "null"
                    ],
                    "minLength": 1,
                    "required": false,
                    "default": null,
                    "description": "Script"
                },
                "notifyEmailAddress": {
                    "type": [
                        "string",
                        "null"
                    ],
                    "format": "email",
                    "required": false,
                    "default": null,
                    "description": "Email address to be emailed if a script error is encountered"
                },
                "notifyHttpUrl": {
                    "type": [
                        "string",
                        "null"
                    ],
                    "format": "uri",
                    "pattern": "^https?://",
                    "required": false,
                    "default": null,
                    "description": "URL to call if a script error is encountered"
                },
                "nextId": {
                    "type": "string",
                    "pattern": "^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$",
                    "required": true,
                    "description": "Next item to connect to if the script engine returns true"
                }
            }
        }
    },


    {
        "id": 121,
        "parentId": 120,
        "templateClass": "ModDevelopNC_Script",
        "name": "Script Engine",
        "type": "NON_CALL",
        "description": "Script Engine",
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": true,
        "defaultStart": false,
        "jsonSchema": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "script": {
                    "type": [
                        "string",
                        "null"
                    ],
                    "minLength": 1,
                    "required": false,
                    "default": null,
                    "description": "Script"
                },
                "notifyEmailAddress": {
                    "type": [
                        "string",
                        "null"
                    ],
                    "format": "email",
                    "required": false,
                    "default": null,
                    "description": "Email address to be used if a script error is encountered"
                },
                "notifyHttpUrl": {
                    "type": [
                        "string",
                        "null"
                    ],
                    "format": "uri",
                    "pattern": "^https?://",
                    "required": false,
                    "default": null,
                    "description": "URL to call if a script error is encountered"
                },
                "nextId": {
                    "type": "string",
                    "pattern": "^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$",
                    "required": true,
                    "description": "Next item to connect to if the script engine returns true"
                }
            }
        }
    },

];

var getItemProperties = function (templateClass) {
    var properties = {};
    for (var i = 0; i < dialplanTemplates.length; i++) {
        if (dialplanTemplates[i].templateClass == templateClass) {
            var obj = dialplanTemplates[i].jsonSchema.properties;
            for (var key in obj) {
                //properties[key] = obj[key].default || null;
                switch (key) {
                    case 'holdMusic':
                        properties[key] = {"type":"AUTO"};
                        break;
                    default: properties[key] = typeof obj[key].default != "undefined" ? obj[key].default : null;
                }

            }
            break;
        }
    }
    return properties;
};

var nodeTemplates = [



    // Call items
    {
        "id": null,
        "parentId": null,
        "templateId": 3,
        "parentTemplateId": 1,
        "type": "CALL",
        //"parentId": null,
        "title": "Inbound Numbers",
        "description": "Inbound Numbers are dialled by people who want to call your organization, You can obtain new Numbers in the Numbers Page",
        "templateClass": 'ModNumber',
        "subItemsTemplateClass": 'ModNumber_Public',
        "configTemplate": 'ModNumber',
        "configCustom": 'ModNumber_Public',
        "activeChildren": false,
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": true,
        //"outputs": [],
        "subItems": [],
        "variables": getItemProperties('ModNumber'),

    },

    {
        "id": null,
        "parentId": null,
        "templateId": 38,
        "parentTemplateId": 1,
        "type": "SYSTEM",
        //"parentId": null,
        "title": "DDI Numbers",
        "name": "DDI Numbers",
        "description": 'The DDI Component will hook all inbound calls to telephone numbers that are configured as DDIs and assigned to users',
        "templateClass": 'ModNumber',
        "subItemsTemplateClass": 'ModNumber_PublicDDI',
        "configTemplate": 'ModNumber_PublicDDI',
        "configCustom": null,
        "activeChildren": false,
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": true,
        //"outputs": [],
        "variables": getItemProperties('ModNumber_PublicDDI'),
        //"subItems": [],


    },

    {
        "id": null,
        "parentId": null,
        "templateId": 39,
        "parentTemplateId": 1,
        "type": "SYSTEM",
        //"parentId": null,
        "title": "Outbound Calls",
        "name": "Outbound Calls",
        "description": "Any outbound dialled number",
        "templateClass": 'ModNumber',
        "subItemsTemplateClass": 'ModNumber_OutboundExternal',
        "configTemplate": 'ModNumber_OutboundExternal',
        "configCustom": null,
        "activeChildren": false,
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": true,
        //"outputs": [],
        "variables": getItemProperties('ModNumber_OutboundExternal'),
        //"subItems": [],


    },

    {
        "id": null,
        "parentId": null,
        "templateId": 16,
        "parentTemplateId": 1,
        "type": "SYSTEM",
        //"parentId": null,
        "title": "Catch All",
        "name": "Catch All",
        "description": "Public numbers owned by the Org that can be dialled from the external telephone network, but have no other policies assigned to them",
        "templateClass": 'ModNumber',
        "subItemsTemplateClass": 'ModNumber_PublicCatchAll',
        "configTemplate": 'ModNumber_PublicCatchAll',
        "configCustom": null,
        "activeChildren": false,
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": true,
        //"outputs": [],
        "variables": getItemProperties('ModNumber_PublicCatchAll'),
        //"subItems": [],


    },

    {
        "id": null,
        "parentId": null,
        "templateId": 31,
        "parentTemplateId": 1,
        "type": "CALL",
        "title": "Extension Number",
        "description": 'An internal extension that can be dialled',
        "templateClass": 'ModNumber',
        "subItemsTemplateClass": 'ModNumber_Internal',
        "configTemplate": 'ModNumber_Internal',
        "configCustom": "ModNumber_Internal",
        "activeChildren": false,
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": true,
        "variables": getItemProperties('ModNumber_Internal'),


    },

    {
        "id": null,
        "parentId": null,
        "templateId": 81,
        "parentTemplateId": 1,
        "type": "CALL",
        "title": "From SIP Trunk",
        "description": "Calls from a PBX via a SIP Trunk",
        "templateClass": 'ModNumber',
        "subItemsTemplateClass": 'ModNumber_FromSIPTrunk',
        "configTemplate": 'ModNumber_FromSIPTrunk',
        "configCustom": null,
        "activeChildren": false,
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": true,
        "variables": getItemProperties('ModNumber_FromSIPTrunk'),
    },

    {
        "id": null,
        "parentId": null,
        "templateId": 3100000,
        "parentTemplateId": 1,
        "type": "CALL",
        "title": "Invokable Destination",
        "description": 'A predefined entry point to reference in a Salesforce Process',
        "templateClass": 'ModNumber',
        "subItemsTemplateClass": 'ModNumber_Internal',
        "configTemplate": 'ModNumber_Internal',
        "configCustom": "ModNumber_Invokable",
        "activeChildren": false,
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": true,
        "variables": getItemProperties('ModNumber_Internal'),


    },
    {
        "id": null,
        "parentId": null,
        "templateId": 4,
        "parentTemplateId": null,
        "type": "CALL",
        "title": 'Action',
        "description": 'A container for action',
        "templateClass": "ModAction",
        "configTemplate": "ModAction",
        "configCustom": null,
        "activeChildren": true,
        "inputConnectorsAllowed": true,
        "outputConnectorsAllowed": true,
        "outputs": [],
        "variables": getItemProperties('ModAction'),
    },

    {
        "id": null,
        "parentId": 4,
        "templateId": 5,
        "parentTemplateId": 4,
        "type": "CALL",
        "title": 'Speak',
        "description": 'Enables you to say a phrase to the caller or called party',
        "templateClass": "ModAction_Say",
        "configTemplate": "ModAction_Say",
        "configCustom": null,
        "outputConnectorsAllowed": false,
        "variables": getItemProperties('ModAction_Say'),
    },

    {
        "id": null,
        "parentId": 4,
        "templateId": 6,
        "parentTemplateId": 4,
        "type": "CALL",
        "title": 'Record a Call',
        "description": 'Record calls and store them in the cloud or email them',
        "templateClass": "ModAction_Record",
        "configTemplate": "ModAction_Record",
        "configCustom": "ModAction_Record",
        //"subItemsTemplateClass": 'ModAction_Say',
        //"configTemplate": "ModAction_Say",
        //"activeChildren": false,
        //"inputConnectorsAllowed": false,
        "outputConnectorsAllowed": false,
        //"outputs": [],
        "variables": getItemProperties('ModAction_Record'),

    },
    
    {
        "id": null,
        "parentId": 4,
        "templateId": 49,
        "parentTemplateId": 7,
        "type": "CALL",
        "title": "Call Queue",
        "description": "Call Queue",
        "templateClass": "ModConnect_Queue",
        "configTemplate": "ModConnect_Queue",
        "configCustom": "ModConnect_Queue",
        //"inputConnectorsAllowed": false,
        "outputConnectorsAllowed": true,
        "config" : {
            "holdMusicType": "AUTO",
            "holdMusicPreset" : "CLASSICAL",
            "holdMusicUrl": "shout://",
            "screen": false,
            "screenHook": null,
            "devOrgId": null,
        },
        "configScreen": {
            "announcement": null,
            "acceptKey": "",
            "waitForResponse": 10,
            "repeat": 5
        },
        "configCallbackAndChime": {
            "callBack": {
                "enabled": false,
                "activationKey": "#",
                "activationPosition": 10,
                "activationElapsedTime": 300,
                "leaveVoiceMail": true,
                "acl": "ANY",
                "aclRegex": "",
                "maximumAttempts": 3,
                "attemptDelays": [900,900,900],
                "cli": "",
                "cliPresentation": "SPECIFIED",
                "customCli": []
            },
            "chime": []
        },
        "variables": getItemProperties('ModConnect_Queue'),
        "variablesScreen": {
            "script": null,
            "notifyEmailAddress": null,
            "notifyHttpUrl": null,
            "nextId": null
        },
    },


    {
        "id": null,
        "parentId": 4,
        "templateId": 118,
        "parentTemplateId": 117,
        "type": "CALL",
        "title": 'Rule',
        "description": 'Rule',
        "templateClass": "ModAction_Rule",
        "configTemplate": "ModAction_Rule",
        "configCustom": "ModAction_Rule",
        //"activeChildren": false,
        //"inputConnectorsAllowed": false,
        "outputConnectorsAllowed": true,
        //"outputs": [],
        "config": {
            "rules": {
                "timeOfDay": [],
                "countryCode": [],
                "callerIdWithheld": [],
                "numberMatch": [],
                "evaluate": []
            },
            "devOrgId": null
        },
        "variables": {
            "script": null,
            "notifyEmailAddress": null,
            "notifyHttpUrl": null,
            "nextId": null
        },

    },
    {
        "id": null,
        "parentId": 4,
        "templateId": 47,
        "parentTemplateId": 4,
        "emailTemplateId": 47,
        "smsTemplateId": 28,
        "developTemplateId": 117,
        "developScriptTemplateId": 118,
        "type": "CALL",
        "title": 'Notify',
        "description": 'Notify',
        "templateClass": "ModAction_Notify",
        "configTemplate": "ModAction_Notify",
        "configCustom": "ModAction_Notify",
        "outputConnectorsAllowed": false,
        "config": {
            "email": getItemProperties('ModAction_NotifyEmail'),
            "sms": getItemProperties('ModAction_NotifySMS'),
            "chatter": {'sendNow':true, 'targetType': 'user', "postText": null, "visibility": "allUsers"},
            "notification": {"targetType": "CHANNEL", "targetUUID": "SELF", "targetUserID": "$(UserID)", "senderDisplayName": "System User", "notificationText": null},
            "chatterScript": {
                "script": null,
                "notifyEmailAddress": null,
                "notifyHttpUrl": null,
                "nextId": null
            },
            "notificationScript": {
                "script": null,
                "nextId": null
            }
        },
        "subItems": {
            "email": [],
            "sms": [],
            "chatter" : [],
            "notification" : [],
        },
    },
    {
        "id": null,
        "parentId": 4,
        "templateId": 118,
        "parentTemplateId": 117,
        "type": "CALL",
        "title": 'Query Object',
        "description": 'Query a Salesforce object and store data in macro',
        "templateClass": "ModConnector_SFQuery",
        "configTemplate": "ModConnector_SFQuery",
        "configCustom": "ModConnector_SFQuery",
        //"activeChildren": false,
        //"inputConnectorsAllowed": false,
        "outputConnectorsAllowed": true,
        //"outputs": [],
        "config": {
            "fieldName": false,
            "mode": "builder",
            "sObject": "Account",
            "orderBy": {"field": "Id", "direction": "ASC"},
            "resultSize": 1,
            "selectedFields": [],
            "filterFields": [],
            "connectorId": null,
            "devOrgId": null,
            "soql": "",
            "resultSet": "MyData",
            "trigger": ["RECORDS_FOUND"]

        },
        "variables": {
            "script": null,
            "notifyEmailAddress": null,
            "notifyHttpUrl": null,
            "nextId": null
        },
    },


    {
        "id": null,
        "parentId": 4,
        "templateId": 118,
        "parentTemplateId": 117,
        "type": "CALL",
        "title": 'Create a Record',
        "description": 'Create a new record in Salesforce',
        "templateClass": "ModConnector_SFStore",
        "configTemplate": "ModConnector_SFStore",
        "configCustom": "ModConnector_SFCreate",
        //"activeChildren": false,
        //"inputConnectorsAllowed": false,
        "outputConnectorsAllowed": true,
        //"outputs": [],
        "config": {
            "connectorId": null,
            "sObject": "Account",
            "fields": [],
            "ownerId": null,
            "resultSet": "MyData",
            "trigger": ["RECORD_CREATED"]
        },
        "variables": {
            "script": null,
            "notifyEmailAddress": null,
            "notifyHttpUrl": null,
            "nextId": null
        },

    },

    {
        "id": null,
        "parentId": 4,
        "templateId": 118,
        "parentTemplateId": 117,
        "type": "CALL",
        "title": 'Update a Record',
        "description": 'Update an existing record in Salesforce',
        "templateClass": "ModConnector_SFStore",
        "configTemplate": "ModConnector_SFStore",
        "configCustom": "ModConnector_SFUpdate",
        //"activeChildren": false,
        //"inputConnectorsAllowed": false,
        "outputConnectorsAllowed": true,
        //"outputs": [],
        "config": {
            "connectorId": null,
            "sObject": "Account",
            "fields": [],
            "recordId": null,
            "resultSet": "MyData",
            "trigger": ["RECORD_CREATED"]
        },
        "variables": {
            "script": null,
            "notifyEmailAddress": null,
            "notifyHttpUrl": null,
            "nextId": null
        },

    },

    {
        "id": null,
        "parentId": 4,
        "templateId": 118,
        "parentTemplateId": 117,
        "type": "CALL",
        "title": 'Connect a Call',
        "description": 'Connects a call to a number, a group or a user',
        "templateClass": "ModConnect",
        "subItemsTemplateClass": "ModDevelop_Script",
        "configTemplate": null,
        "configCustom": 'ModConnect_ModDevelop_Script',
        "outputConnectorsAllowed": true,
        "config": {
            "dialMethod": "connectAction",
            "connectAction": {
                "ddi": {
                    "method": "NUMBER",
                    "target": null
                },
                "public": {
                    "method": "NUMBER",
                    "target": null
                },
                "outbound": {
                    "method": "NUMBER",
                    "target": null
                },
                "extension": {
                    "method": "NUMBER",
                    "target": null
                },
                "default": {
                    "method": "NUMBER",
                    "target": null
                }
            },
            "trigger": [
                "CALL_CONNECTED",
                "CALL_NOT_CONNECTED",
                "CAMP_EXIT"
            ],
            "connectTimeout": 30,
            "callWaiting": false,
            "hangupAfterBridge": false,
            "transferAfterConnect": '',
            "continueOnFail": true,
            "dtmfEnabled": false,
            "dtmfStream": null,
            "dtmfToneLength": 2000,
            "callerIdName": null,
            "screen": false,
            "screenHook": null,
            "camp": {
                "enabled": false,
                "campEntry": "RING_TONE",
                "music": "moh://default",
                "chimeMessage": "I am sorry to keep you waiting",
                "campProgress": "MUSIC",
                "chimeDelay": 10,
                "dialAttempts": 3,
                "dialSleep": 10,
                "campExit": "1"
            },
            "devOrgId": null,
        },
        "configScreen": {
            "announcement": null,
            "acceptKey": "",
            "waitForResponse": 10,
            "repeat": 5
        },
        "variables": {
            "script": null,
            "notifyEmailAddress": null,
            "notifyHttpUrl": null,
            "nextId": null
        }
    },


    {
        "id": null,
        "parentId": 4,
        "templateId": 118,
        "parentTemplateId": 117,
        "type": "CALL",
        "title": 'Hunt Group',
        "description": 'Dials multiple Users, Groups and Numbers',
        "templateClass": "ModConnect_FollowMe",
        "subItemsTemplateClass": "ModDevelop_Script",
        "configTemplate": null,
        "configCustom": 'ModConnect_FollowMe_ModDevelop_Script',
        "outputConnectorsAllowed": true,
        "config": {
            "dialMethod": "followMe",
            "followMe": [],
            "trigger": [
                "CALL_CONNECTED",
                "CALL_NOT_CONNECTED",
                "CAMP_EXIT"
            ],
            "connectTimeout": 30,
            "callWaiting": false,
            "hangupAfterBridge": false,
            "transferAfterConnect": '',
            "continueOnFail": true,
            "dtmfEnabled": false,
            "dtmfStream": null,
            "dtmfToneLength": 2000,
            "callerIdName": null,
            "screen": false,
            "screenHook": null,
            "camp": {
                "enabled": false,
                "campEntry": "RING_TONE",
                "music": "moh://default",
                "chimeMessage": "I am sorry to keep you waiting",
                "campProgress": "MUSIC",
                "chimeDelay": 10,
                "dialAttempts": 3,
                "dialSleep": 10,
                "campExit": "1"
            },
            "devOrgId": null,
        },
        "configScreen": {
            "announcement": null,
            "acceptKey": "",
            "waitForResponse": 10,
            "repeat": 5
        },
        "variables": {
            "script": null,
            "notifyEmailAddress": null,
            "notifyHttpUrl": null,
            "nextId": null
        }
    },


    {
        "id": null,
        "parentId": null,
        "templateId": 9,
        "parentTemplateId": null,
        "type": "CALL",
        "title": "SwitchBoard",
        "description": "Enables you to route calls based on user selecting from options",
        "templateClass": "ModSwitchBoard",
        "subItemsTemplateClass": null,
        "configTemplate": "ModSwitchBoard",
        "activeChildren": true,
        "inputConnectorsAllowed": true,
        "outputConnectorsAllowed": true,
        "outputs": [],
        "variables": getItemProperties('ModSwitchBoard'),
    },


    {

        "id": null,
        "parentId": 9,
        "templateId": 10,
        "parentTemplateId": 9,
        "type": "CALL",
        "title": "Switch Item",
        "name": "Switch Item",
        "description": "Enables you to route calls based on user selecting from options",
        "templateClass": "ModSwitchBoard_SwitchItem",
        "configTemplate": "ModSwitchBoard_SwitchItem",
        "outputConnectorsAllowed": true,
        "variables": getItemProperties('ModSwitchBoard_SwitchItem')
    },

    {
        "id": null,
        "parentId": 9,
        "templateId": 34,
        "parentTemplateId": 9,
        "type": "CALL",
        "title": "Get Info",
        "name": "Get Info",
        "description": "Gets information from user",
        "templateClass": "ModSwitchBoard_ItemGetInfo",
        "configTemplate": "ModSwitchBoard_ItemGetInfo",
        "outputConnectorsAllowed": true,
        "variables": getItemProperties('ModSwitchBoard_ItemGetInfo')
    },
    {
        "id": null,
        "parentId": null,
        "templateId": 66,
        "parentTemplateId": null,
        "type": "CALL",
        "title": "To Policy",
        "description": "Connect to another policy",
        "templateClass": "ModPolicy",
        "configTemplate": "ModPolicy",
        "activeChildren": true,
        "inputConnectorsAllowed": true,
        "outputConnectorsAllowed": false,
        "outputs": [],
        "variables": getItemProperties('ModPolicy'),
    },
    {
        "id": null,
        "parentId": null,
        "templateId": 23,
        "parentTemplateId": null,
        "type": "CALL",
        "title": "Finish",
        "description": "A set of components that allow you to finish your dial plan",
        "templateClass": "ModFinish",
        "configTemplate": "ModFinish",
        "activeChildren": true,
        "inputConnectorsAllowed": true,
        "outputConnectorsAllowed": false,
        "outputs": [],
        "variables": getItemProperties('ModFinish'),
    },


    {

        "id": null,
        "parentId": 23,
        "templateId": 24,
        "parentTemplateId": 23,
        "type": "CALL",
        "title": "Voice Mail",
        "name": "Voice Mail",
        "description": "Sends a call to a voice mail box before hanging up",
        "templateClass": "ModFinish_VoiceMail",
        "configTemplate": "ModFinish_VoiceMail",
        "configCustom": 'ModFinish_VoiceMail',
        "outputConnectorsAllowed": false,
        "variables": getItemProperties('ModFinish_VoiceMail')
    },




    {
        "id": null,
        "parentId": 66,
        "templateId": 64,
        "parentTemplateId": 66,
        "parentNoOutput": true,
        "type": "CALL",
        "title": "Call Policy",
        "description": "Connect to another policy",
        "templateClass": 'ModPolicy_ToCall',
        "configTemplate": 'ModPolicy_ToCall',
        "configCustom": 'ModPolicy_ToCall',
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": false,
        "outputs": [],
        "variables": getItemProperties('ModPolicy_ToCall')
    },
    {
        "id": null,
        "parentId": 66,
        "templateId": 65,
        "parentTemplateId": 66,
        "parentNoOutput": true,
        "type": "CALL",
        "title": "Data Analytics",
        "description": "Invoke a Data Analytics Policy",
        "templateClass": 'ModPolicy_ToNonCall',
        "configTemplate": 'ModPolicy_ToNonCall',
        "configCustom": 'ModPolicy_ToNonCall',
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": true,
        "outputs": [],
        "variables": getItemProperties('ModPolicy_ToNonCall')
    },
    //NON_CALL
    {
        "id": null,
        "parentId": null,
        "templateId": 92,
        "parentTemplateId": null,
        "type": "NON_CALL",
        "title": "Start",
        "description": "Start",
        "templateClass": 'ModStartNC',
        "configTemplate": 'ModStartNC',
        "activeChildren": true,
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": false,
        "outputs": [],
        "variables": getItemProperties('ModStartNC')
    },


    {
        "id": null,
        "parentId": 92,
        "templateId": 127,
        "parentTemplateId": 92,
        "type": "NON_CALL",
        "title": "Call Common",
        "description": "Common non call policy to run in conjunction with all Call policies",
        "templateClass": 'ModStartNC_CallCommon',
        "configTemplate": 'ModStartNC_CallCommon',
        "activeChildren": false,
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": true,
        "variables": getItemProperties('ModStartNC_CallCommon'),
    },


    {
        "id": null,
        "parentId": null,
        "templateId": 94,
        "parentTemplateId": null,
        "type": "NON_CALL",
        "title": 'Action',
        "description": 'A container for action',
        "templateClass": "ModActionNC",
        "configTemplate": "ModActionNC",
        "configCustom": null,
        "activeChildren": true,
        "inputConnectorsAllowed": true,
        "outputConnectorsAllowed": true,
        "outputs": [],
        "variables": getItemProperties('ModAction'),
    },

    {
        "id": null,
        "parentId": 94,
        "templateId": 95,
        "parentTemplateId": 94,
        "type": "NON_CALL",
        "title": 'Debug',
        "description": 'Debug',
        "templateClass": "ModActionNC_Debug",
        "configTemplate": "ModActionNC_Debug",
        "configCustom": "ModActionNC_Debug",
        "outputConnectorsAllowed": false,
        "outputs": [],
        "variables": getItemProperties('ModActionNC_Debug'),
    },

    {
        "id": null,
        "parentId": 94,
        "templateId": 121,
        "parentTemplateId": 120,
        "type": "NON_CALL",
        "title": 'Rule',
        "description": 'Rule',
        "templateClass": "ModAction_Rule",
        "configTemplate": "ModAction_Rule",
        "configCustom": "ModAction_Rule",
        "outputConnectorsAllowed": true,
        "config": {
            "rules": {
                "timeOfDay": [],
                "countryCode": [],
                "callerIdWithheld": [],
                "numberMatch": [],
                "evaluate": []
            },
            "devOrgId": null
        },
        "variables": {
            "script": null,
            "notifyEmailAddress": null,
            "notifyHttpUrl": null,
            "nextId": null
        },
    },

    {
        "id": null,
        "parentId": 94,
        "templateId": 98,
        "parentTemplateId": 94,
        "emailTemplateId": 98,
        "smsTemplateId": 99,
        "developTemplateId": 120,
        "developScriptTemplateId": 121,
        "type": "NON_CALL",
        "title": 'Notify',
        "description": 'Notify',
        "templateClass": "ModAction_Notify",
        "configTemplate": "ModAction_Notify",
        "configCustom": "ModAction_Notify",
        "outputConnectorsAllowed": false,
        "config": {
            "email": getItemProperties('ModActionNC_NotifyEmail'),
            "sms": getItemProperties('ModActionNC_NotifySMS'),
            "chatter": {'sendNow':true, 'targetType': 'user', "postText": null, "visibility": "allUsers"},
            "notification": {"targetType": "CHANNEL", "targetUUID": "SELF", "targetUserID": "$(UserID)", "senderDisplayName": "System User", "notificationText": null},
            "chatterScript": {
                "script": null,
                "notifyEmailAddress": null,
                "notifyHttpUrl": null,
                "nextId": null
            },
            "notificationScript": {
                "script": null,
                "nextId": null
            }
        },
        "subItems": {
            "email": [],
            "sms": [],
            "chatter" : [],
            "notification" : []
        },
    },

    {
        "id": null,
        "parentId": 94,
        "templateId": 121,
        "parentTemplateId": 120,
        "type": "NON_CALL",
        "title": 'Query Object',
        "description": 'Query a Salesforce object and store data in macro',
        "templateClass": "ModConnector_SFQuery",
        "configTemplate": "ModConnector_SFQuery",
        "configCustom": "ModConnector_SFQuery",
        "outputConnectorsAllowed": true,
        "config": {
            "fieldName": false,
            "mode": "builder",
            "sObject": "Account",
            "orderBy": {"field": "Id", "direction": "ASC"},
            "resultSize": 1,
            "selectedFields": [],
            "filterFields": [],
            "connectorId": null,
            "devOrgId": null,
            "soql": "",
            "resultSet": "MyData",
            "trigger": ["RECORDS_FOUND"]

        },
        "variables": {
            "script": null,
            "notifyEmailAddress": null,
            "notifyHttpUrl": null,
            "nextId": null
        },
    },

    {
        "id": null,
        "parentId": 94,
        "templateId": 121,
        "parentTemplateId": 120,
        "type": "NON_CALL",
        "title": 'Create a Record',
        "description": 'Create a new record in Salesforce',
        "templateClass": "ModConnector_SFStore",
        "configTemplate": "ModConnector_SFStore",
        "configCustom": "ModConnector_SFCreate",
        "outputConnectorsAllowed": true,
        "config": {
            "connectorId": null,
            "sObject": "Account",
            "fields": [],
            "ownerId": null,
            "resultSet": "MyData",
            "trigger": ["RECORD_CREATED"]
        },
        "variables": {
            "script": null,
            "notifyEmailAddress": null,
            "notifyHttpUrl": null,
            "nextId": null
        },
    },

    {
        "id": null,
        "parentId": 94,
        "templateId": 121,
        "parentTemplateId": 120,
        "type": "NON_CALL",
        "title": 'Update a Record',
        "description": 'Update an existing record in Salesforce',
        "templateClass": "ModConnector_SFStore",
        "configTemplate": "ModConnector_SFStore",
        "configCustom": "ModConnector_SFUpdate",
        "outputConnectorsAllowed": true,
        "config": {
            "connectorId": null,
            "sObject": "Account",
            "fields": [],
            "recordId": null,
            "resultSet": "MyData",
            "trigger": ["RECORD_CREATED"]
        },
        "variables": {
            "script": null,
            "notifyEmailAddress": null,
            "notifyHttpUrl": null,
            "nextId": null
        },
    },


    {
        "id": null,
        "parentId": null,
        "templateId": 2,
        "parentTemplateId": null,
        "type": "SYSTEM",
        "title": "From Policy",
        "description": "DialPlan Start provides various components which are entry points for the dial plan from other policies",
        "templateClass": 'ModFromPolicy',
        "configTemplate": 'ModFromPolicy',
        "activeChildren": false,
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": true,
        "variables": getItemProperties('ModFromPolicy'),

    },


    {
        "id": null,
        "parentId": 4,
        "templateId": 118,
        "parentTemplateId": 117,
        "type": "CALL",
        "title": 'Script Engine',
        "description": 'Lua Scripting Engine',
        "templateClass": "ModDevelop_Script",
        "configTemplate": "ModDevelop_Script",
        "configCustom": "ModDevelop_Script",
        "outputConnectorsAllowed": true,
        "variables": {
            "script": null,
            "notifyEmailAddress": null,
            "notifyHttpUrl": null,
            "nextId": null
        }
    },

    {
        "id": null,
        "parentId": 94,
        "templateId": 121,
        "parentTemplateId": 120,
        "type": "NON_CALL",
        "title": 'Script Engine',
        "description": 'Lua Scripting Engine',
        "templateClass": "ModDevelopNC_Script",
        "configTemplate": "ModDevelopNC_Script",
        "configCustom": "ModDevelop_Script",
        "outputConnectorsAllowed": true,
        "variables": {
            "script": null,
            "notifyEmailAddress": null,
            "notifyHttpUrl": null,
            "nextId": null
        }
    },

    {
        "id": null,
        "parentId": null,
        "templateId": 93,
        "parentTemplateId": 92,
        "type": "NON_CALL",
        "title": 'Inbound Message',
        "description": 'Inbound Message',
        "templateClass": "ModStartNC_Trigger",
        "configTemplate": "ModStartNC_Trigger",
        "configCustom": null,
        "activeChildren": false,
        "inputConnectorsAllowed": false,
        "outputConnectorsAllowed": true,
        "variables": getItemProperties('ModStartNC_Trigger'),
    },

    {
        "id": null,
        "parentId": 4,
        "templateId": 118,
        "parentTemplateId": 117,
        "type": "CALL",
        "title": 'Manage Properties',
        "description": 'Modify properties that will affect characteristics of the call',
        "templateClass": "ModAction_ModifyCharacteristic",
        "configTemplate": "ModAction_ModifyCharacteristic",
        "configCustom": "ModAction_ModifyCharacteristic",
        "outputConnectorsAllowed": false,
        "config": {
            "connectorId": null,
            "devOrgId": null,
            "enableDebug": false,
            "namespacePrefix": null,
            "builtInProperties": [],
            "customProperties": []
        },
        "variables": {
            "script": null,
            "notifyEmailAddress": null,
            "notifyHttpUrl": null,
            "nextId": null
        }

    },
    {
        "id": null,
        "parentId": 4,
        "templateId": 118,
        "parentTemplateId": 117,
        "type": "CALL",
        "title": 'Record and Analyse',
        "description": 'Record calls,store them in the cloud or email them and insight analysis',
        "templateClass": "ModAction_RecordAnalyse",
        "configTemplate": "ModAction_RecordAnalyse",
        "configCustom": "ModAction_RecordAnalyse",
        "outputConnectorsAllowed": false,
        "config": {
            "connectorId": null,
            "devOrgId": null,
            "enableDebug": false,
            "namespacePrefix": null,
            "builtInProperties": [],
            "customProperties": [],
            "retain": null,
            "emailSend" : null,
            "insightConfig" : 'Main',
            "record" : {
                "channel": 'SELF',
                "start": 'ON_CONNECT',
                "archivePolicyId": null,
             }, 
            "pauseAllowed": false,
            "stopAllowed": false,
             "email" : {
                "toRecipients": [],
                "ccRecipients": [],
                "subject":  ""
              },
              "beepAlert" :{
                "channel":"NONE",
                "tgml":""
              },
              "insight" : {
                "isEnabled" : false,
                "transcription": false,
                "talkTime": false,
                "language": "EN-US",
                "channel": "SELF",
                "region": "US",
                "categoryFilter": ["*"],
                "systemCategoryFilter": ["*"],
                "vocabulary": ["*"]
              }
            
        },
        "variables": {
            "script": null,
            "notifyEmailAddress": null,
            "notifyHttpUrl": null,
            "nextId": null
        }

    },
    {
        "id": null,
        "parentId": 4,
        "templateId": 118,
        "parentTemplateId": 117,
        "type": "CALL",
        "title": 'Request Skills',
        "description": 'Request one or more skills',
        "templateClass": "ModAction_RequestSkills",
        "configTemplate": "ModAction_RequestSkills",
        "configCustom": "ModAction_RequestSkills",
        "outputConnectorsAllowed": false,
        "config": {
            "connectorId": null,
            "devOrgId": null,
            "enableDebug": false,
            "namespacePrefix": null,
            "skills": [],
            "deleteSkills":false
        },
        "variables": {
            "script": null,
            "notifyEmailAddress": null,
            "notifyHttpUrl": null,
            "nextId": null
        }

    },
    {
        "id": null,
        "parentId": 94,
        "templateId": 121,
        "parentTemplateId": 120,
        "type": "NON_CALL",
        "title": 'Manage Properties',
        "description": 'Modify properties that will affect characteristics of the call',
        "templateClass": "ModActionNC_ModifyCharacteristic",
        "configTemplate": "ModActionNC_ModifyCharacteristic",
        "configCustom": "ModAction_ModifyCharacteristic",
        "outputConnectorsAllowed": false,
        "config": {
            "connectorId": null,
            "devOrgId": null,
            "enableDebug": false,
            "namespacePrefix": null,
            //
            "customProperties": [],

        },
        "variables": {
            "script": null,
            "notifyEmailAddress": null,
            "notifyHttpUrl": null,
            "nextId": null
        },

    },

];

var requiredLicense = {
    "ModNumber_ModNumber_Public_3":{
        //"templateClass":"ModNumber",
        //"configCustom":"ModNumber_Public",
        "PBX__c":true,
        "Manager__c":true,
        "Record__c":true,
        "Numbers__c":true
    },
    "ModNumber_null_38":{
        //"templateClass":"ModNumber",
        //"configCustom":null,
        "PBX__c":true,
        "Manager__c":true,
        "Record__c":false,
        "Numbers__c":false
    },
    "ModNumber_null_39":{
        //"templateClass":"ModNumber",
        //"configCustom":null,
        "PBX__c":true,
        "Manager__c":true,
        "Record__c":false,
        "Numbers__c":false
    },
    "ModNumber_null_16":{
        //"templateClass":"ModNumber",
        //"configCustom":null,
        "PBX__c":true,
        "Manager__c":true,
        "Record__c":false,
        "Numbers__c":false
    },
    "ModNumber_ModNumber_Internal_31":{
        //"templateClass":"ModNumber",
        //"configCustom":"ModNumber_Internal",
        "PBX__c":true,
        "Manager__c":true,
        "Record__c":false,
        "Numbers__c":false
    },
    "ModNumber_ModNumber_Invokable_3100000":{
        //"templateClass":"ModNumber",
        //"configCustom":"ModNumber_Invokable",
        "PBX__c":false,
        "Manager__c":true,
        "Record__c":false,
        "Numbers__c":false
    },
    "ModAction_null_4":{
        //"templateClass":"ModAction",
        //"configCustom":null,
        "PBX__c":true,
        "Manager__c":true,
        "Record__c":true,
        "Numbers__c":true
    },
    "ModAction_Say_null_5":{
        //"templateClass":"ModAction_Say",
        //"configCustom":null,
        "PBX__c":true,
        "Manager__c":true,
        "Record__c":false,
        "Numbers__c":false
    },
    "ModAction_Record_ModAction_Record_6":{
        //"templateClass":"ModAction_Record",
        //"configCustom":"ModAction_Record",
        "PBX__c":false,
        "Manager__c":false,
        "Record__c":true,
        "Numbers__c":false,
        "Record_Count__c":0
    },
    "ModAction_RecordAnalyse_ModAction_RecordAnalyse_118":{
        //"templateClass":"ModAction_Record",
        //"configCustom":"ModAction_Record",
        "PBX__c":false,
        "Manager__c":false,
        "Record__c":true,
        "Numbers__c":false,
        "Record_Count__c":0
    },
    "ModConnect_Queue_ModConnect_Queue_49":{
        //"templateClass":"ModConnect_Queue",
        //"configCustom":"ModConnect_Queue",
        "PBX__c":false,
        "Manager__c":true,
        "Record__c":false,
        "Numbers__c":false
    },
    "ModAction_Rule_ModAction_Rule_118":{
        //"templateClass":"ModAction_Rule",
        //"configCustom":"ModAction_Rule",
        "PBX__c":true,
        "Manager__c":true,
        "Record__c":false,
        "Numbers__c":false
    },
    "ModAction_Notify_ModAction_Notify_47":{
        //"templateClass":"ModAction_Notify",
        //"configCustom":"ModAction_Notify",
        "PBX__c":true,
        "Manager__c":true,
        "Record__c":false,
        "Numbers__c":false
    },
    "ModConnector_SFQuery_ModConnector_SFQuery_118":{
        //"templateClass":"ModConnector_SFQuery",
        //"configCustom":"ModConnector_SFQuery",
        "PBX__c":false,
        "Manager__c":true,
        "Record__c":false,
        "Numbers__c":false
    },
    "ModConnector_SFStore_ModConnector_SFCreate_118":{
        //"templateClass":"ModConnector_SFStore",
        //"configCustom":"ModConnector_SFCreate",
        "PBX__c":false,
        "Manager__c":true,
        "Record__c":false,
        "Numbers__c":false
    },
    "ModConnector_SFStore_ModConnector_SFUpdate_118":{
        //"templateClass":"ModConnector_SFStore",
        //"configCustom":"ModConnector_SFUpdate",
        "PBX__c":false,
        "Manager__c":true,
        "Record__c":false,
        "Numbers__c":false
    },
    "ModConnect_ModConnect_ModDevelop_Script_118":{
        //"templateClass":"ModConnect",
        //"configCustom":"ModConnect_ModDevelop_Script",
        "PBX__c":true,
        "Manager__c":true,
        "Record__c":true,
        "Numbers__c":true
    },
    "ModConnect_FollowMe_ModConnect_FollowMe_ModDevelop_Script_118":{
        //"templateClass":"ModConnect",
        //"configCustom":"ModConnect_FollowMe_ModDevelop_Script",
        "PBX__c":true,
        "Manager__c":true,
        "Record__c":true,
        "Numbers__c":true
    },
    "ModSwitchBoard_undefined_9":{
        //"templateClass":"ModSwitchBoard",
        "PBX__c":true,
        "Manager__c":true,
        "Record__c":false,
        "Numbers__c":false
    },
    "ModSwitchBoard_SwitchItem_undefined_10":{
        //"templateClass":"ModSwitchBoard_SwitchItem",
        "PBX__c":true,
        "Manager__c":true,
        "Record__c":false,
        "Numbers__c":false
    },
    "ModSwitchBoard_ItemGetInfo_undefined_34":{
        //"templateClass":"ModSwitchBoard_ItemGetInfo",
        "PBX__c":true,
        "Manager__c":true,
        "Record__c":false,
        "Numbers__c":false
    },
    "ModPolicy_undefined_66":{
        //"templateClass":"ModPolicy",
        "PBX__c":true,
        "Manager__c":true,
        "Record__c":false,
        "Numbers__c":false
    },
    "ModFinish_undefined_23":{
        //"templateClass":"ModFinish",
        "PBX__c":true,
        "Manager__c":true,
        "Record__c":false,
        "Numbers__c":true
    },
    "ModFinish_VoiceMail_ModFinish_VoiceMail_24":{
        //"templateClass":"ModFinish_VoiceMail",
        //"configCustom":"ModFinish_VoiceMail",
        "PBX__c":true,
        "Manager__c":false,
        "Record__c":false,
        "Numbers__c":false
    },
    "ModPolicy_ToCall_ModPolicy_ToCall_64":{
        //"templateClass":"ModPolicy_ToCall",
        //"configCustom":"ModPolicy_ToCall",
        "PBX__c":true,
        "Manager__c":true,
        "Record__c":false,
        "Numbers__c":false
    },
    "ModPolicy_ToNonCall_ModPolicy_ToNonCall_65":{
        //"templateClass":"ModPolicy_ToNonCall",
        //"configCustom":"ModPolicy_ToNonCall",
        "PBX__c":true,
        "Manager__c":true,
        "Record__c":false,
        "Numbers__c":false
    },
    "ModStartNC_undefined_92":{
        //"templateClass":"ModStartNC",
        "PBX__c":true,
        "Manager__c":true,
        "Record__c":false,
        "Numbers__c":false
    },
    "ModStartNC_CallCommon_undefined_127":{
        //"templateClass":"ModStartNC_CallCommon",
        "PBX__c":true,
        "Manager__c":true,
        "Record__c":false,
        "Numbers__c":false
    },
    "ModActionNC_null_94":{
        //"templateClass":"ModActionNC",
        //"configCustom":null,
        "PBX__c":true,
        "Manager__c":true,
        "Record__c":true,
        "Numbers__c":true
    },
    "ModActionNC_Debug_ModActionNC_Debug_95":{
        //"templateClass":"ModActionNC_Debug",
        //"configCustom":"ModActionNC_Debug",
        "PBX__c":true,
        "Manager__c":true,
        "Record__c":false,
        "Numbers__c":false
    },
    "ModAction_Rule_ModAction_Rule_121":{
        //"templateClass":"ModAction_Rule",
        //"configCustom":"ModAction_Rule",
        "PBX__c":true,
        "Manager__c":true,
        "Record__c":false,
        "Numbers__c":false
    },
    "ModAction_Notify_ModAction_Notify_98":{
        //"templateClass":"ModAction_Notify",
        //"configCustom":"ModAction_Notify",
        "PBX__c":true,
        "Manager__c":true,
        "Record__c":false,
        "Numbers__c":false
    },
    "ModConnector_SFQuery_ModConnector_SFQuery_121":{
        //"templateClass":"ModConnector_SFQuery",
        //"configCustom":"ModConnector_SFQuery",
        "PBX__c":false,
        "Manager__c":true,
        "Record__c":false,
        "Numbers__c":false
    },
    "ModConnector_SFStore_ModConnector_SFCreate_121":{
        //"templateClass":"ModConnector_SFStore",
        //"configCustom":"ModConnector_SFCreate",
        "PBX__c":false,
        "Manager__c":true,
        "Record__c":false,
        "Numbers__c":false
    },
    "ModConnector_SFStore_ModConnector_SFUpdate_121":{
        //"templateClass":"ModConnector_SFStore",
        //"configCustom":"ModConnector_SFUpdate",
        "PBX__c":false,
        "Manager__c":true,
        "Record__c":false,
        "Numbers__c":false
    },
    "ModFromPolicy_undefined_2":{
        //"templateClass":"ModFromPolicy",
        "PBX__c":true,
        "Manager__c":true,
        "Record__c":false,
        "Numbers__c":false
    },
    "ModDevelop_Script_ModDevelop_Script_118":{
        //"templateClass":"ModDevelop_Script",
        //"configCustom":"ModDevelop_Script",
        "PBX__c":true,
        "Manager__c":true,
        "Record__c":false,
        "Numbers__c":false
    },
    "ModDevelopNC_Script_ModDevelop_Script_121":{
        //"templateClass":"ModDevelopNC_Script",
        //"configCustom":"ModDevelop_Script",
        "PBX__c":true,
        "Manager__c":true,
        "Record__c":false,
        "Numbers__c":false
    },
    "ModStartNC_Trigger_null_93":{
        //"templateClass":"ModStartNC_Trigger",
        //"configCustom":null,
        "PBX__c":false,
        "Manager__c":true,
        "Record__c":false,
        "Numbers__c":false
    },
    "ModAction_ModifyCharacteristic_ModAction_ModifyCharacteristic_118":{
        //"templateClass":"ModStartNC_Trigger",
        //"configCustom":null,
        "PBX__c":true,
        "Manager__c":true,
        "Record__c":false,
        "Numbers__c":false
    },
    "ModAction_RequestSkills_ModAction_RequestSkills_118":{
        "PBX__c":true,
        "Manager__c":true,
        "Record__c":false,
        "Numbers__c":false
    },
    "ModActionNC_ModifyCharacteristic_ModAction_ModifyCharacteristic_121":{
        //"templateClass":"ModStartNC_Trigger",
        //"configCustom":null,
        "PBX__c":true,
        "Manager__c":true,
        "Record__c":false,
        "Numbers__c":false
    }
};

//empty chart
var newChartDataModel = {
    "id": null,
    "remoteId": null,
    "name": null,
    "type": null,
    "source": "USER",
    "description": null,
    "zoom": 1,
    "connectionType": "smooth",
    "color": true,
    "nodes": [],
    "connections": [],
    "translateX": 0,
    "translateY": 0

};

var countryCodes = [{"name":"Afghanistan","alpha2Code":"AF","alpha3Code":"AFG","callingCode":"93"},{"name":"Aland Islands","alpha2Code":"AX","alpha3Code":"ALA","callingCode":"358"},{"name":"Albania","alpha2Code":"AL","alpha3Code":"ALB","callingCode":"355"},{"name":"Algeria","alpha2Code":"DZ","alpha3Code":"DZA","callingCode":"213"},{"name":"American Samoa","alpha2Code":"AS","alpha3Code":"ASM","callingCode":"1684"},{"name":"Andorra","alpha2Code":"AD","alpha3Code":"AND","callingCode":"376"},{"name":"Angola","alpha2Code":"AO","alpha3Code":"AGO","callingCode":"244"},{"name":"Anguilla","alpha2Code":"AI","alpha3Code":"AIA","callingCode":"1264"},{"name":"Antarctica","alpha2Code":"AQ","alpha3Code":"ATA","callingCode":"672"},{"name":"Antigua and Barbuda","alpha2Code":"AG","alpha3Code":"ATG","callingCode":"1268"},{"name":"Argentina","alpha2Code":"AR","alpha3Code":"ARG","callingCode":"54"},{"name":"Armenia","alpha2Code":"AM","alpha3Code":"ARM","callingCode":"374"},{"name":"Aruba","alpha2Code":"AW","alpha3Code":"ABW","callingCode":"297"},{"name":"Australia","alpha2Code":"AU","alpha3Code":"AUS","callingCode":"61"},{"name":"Austria","alpha2Code":"AT","alpha3Code":"AUT","callingCode":"43"},{"name":"Azerbaijan","alpha2Code":"AZ","alpha3Code":"AZE","callingCode":"994"},{"name":"Bahamas","alpha2Code":"BS","alpha3Code":"BHS","callingCode":"1242"},{"name":"Bahrain","alpha2Code":"BH","alpha3Code":"BHR","callingCode":"973"},{"name":"Bangladesh","alpha2Code":"BD","alpha3Code":"BGD","callingCode":"880"},{"name":"Barbados","alpha2Code":"BB","alpha3Code":"BRB","callingCode":"1246"},{"name":"Belarus","alpha2Code":"BY","alpha3Code":"BLR","callingCode":"375"},{"name":"Belgium","alpha2Code":"BE","alpha3Code":"BEL","callingCode":"32"},{"name":"Belize","alpha2Code":"BZ","alpha3Code":"BLZ","callingCode":"501"},{"name":"Benin","alpha2Code":"BJ","alpha3Code":"BEN","callingCode":"229"},{"name":"Bermuda","alpha2Code":"BM","alpha3Code":"BMU","callingCode":"1441"},{"name":"Bhutan","alpha2Code":"BT","alpha3Code":"BTN","callingCode":"975"},{"name":"Bolivia (Plurinational State of)","alpha2Code":"BO","alpha3Code":"BOL","callingCode":"591"},{"name":"Bonaire, Sint Eustatius and Saba","alpha2Code":"BQ","alpha3Code":"BES","callingCode":"5997"},{"name":"Bosnia and Herzegovina","alpha2Code":"BA","alpha3Code":"BIH","callingCode":"387"},{"name":"Botswana","alpha2Code":"BW","alpha3Code":"BWA","callingCode":"267"},{"name":"Brazil","alpha2Code":"BR","alpha3Code":"BRA","callingCode":"55"},{"name":"British Indian Ocean Territory","alpha2Code":"IO","alpha3Code":"IOT","callingCode":"246"},{"name":"Virgin Islands (British)","alpha2Code":"VG","alpha3Code":"VGB","callingCode":"1284"},{"name":"Virgin Islands (U.S.)","alpha2Code":"VI","alpha3Code":"VIR","callingCode":"1 340"},{"name":"Brunei Darussalam","alpha2Code":"BN","alpha3Code":"BRN","callingCode":"673"},{"name":"Bulgaria","alpha2Code":"BG","alpha3Code":"BGR","callingCode":"359"},{"name":"Burkina Faso","alpha2Code":"BF","alpha3Code":"BFA","callingCode":"226"},{"name":"Burundi","alpha2Code":"BI","alpha3Code":"BDI","callingCode":"257"},{"name":"Cambodia","alpha2Code":"KH","alpha3Code":"KHM","callingCode":"855"},{"name":"Cameroon","alpha2Code":"CM","alpha3Code":"CMR","callingCode":"237"},{"name":"Canada","alpha2Code":"CA","alpha3Code":"CAN","callingCode":" 1"},{"name":"Cabo Verde","alpha2Code":"CV","alpha3Code":"CPV","callingCode":"238"},{"name":"Cayman Islands","alpha2Code":"KY","alpha3Code":"CYM","callingCode":"1345"},{"name":"Central African Republic","alpha2Code":"CF","alpha3Code":"CAF","callingCode":"236"},{"name":"Chad","alpha2Code":"TD","alpha3Code":"TCD","callingCode":"235"},{"name":"Chile","alpha2Code":"CL","alpha3Code":"CHL","callingCode":"56"},{"name":"China","alpha2Code":"CN","alpha3Code":"CHN","callingCode":"86"},{"name":"Christmas Island","alpha2Code":"CX","alpha3Code":"CXR","callingCode":"61"},{"name":"Cocos (Keeling) Islands","alpha2Code":"CC","alpha3Code":"CCK","callingCode":"61"},{"name":"Colombia","alpha2Code":"CO","alpha3Code":"COL","callingCode":"57"},{"name":"Comoros","alpha2Code":"KM","alpha3Code":"COM","callingCode":"269"},{"name":"Congo","alpha2Code":"CG","alpha3Code":"COG","callingCode":"242"},{"name":"Congo (Democratic Republic of the)","alpha2Code":"CD","alpha3Code":"COD","callingCode":"243"},{"name":"Cook Islands","alpha2Code":"CK","alpha3Code":"COK","callingCode":"682"},{"name":"Costa Rica","alpha2Code":"CR","alpha3Code":"CRI","callingCode":"506"},{"name":"Croatia","alpha2Code":"HR","alpha3Code":"HRV","callingCode":"385"},{"name":"Cuba","alpha2Code":"CU","alpha3Code":"CUB","callingCode":"53"},{"name":"Curaçao","alpha2Code":"CW","alpha3Code":"CUW","callingCode":"599"},{"name":"Cyprus","alpha2Code":"CY","alpha3Code":"CYP","callingCode":"357"},{"name":"Czech Republic","alpha2Code":"CZ","alpha3Code":"CZE","callingCode":"420"},{"name":"Denmark","alpha2Code":"DK","alpha3Code":"DNK","callingCode":"45"},{"name":"Djibouti","alpha2Code":"DJ","alpha3Code":"DJI","callingCode":"253"},{"name":"Dominica","alpha2Code":"DM","alpha3Code":"DMA","callingCode":"1767"},{"name":"Dominican Republic","alpha2Code":"DO","alpha3Code":"DOM","callingCode":"1809"},{"name":"Ecuador","alpha2Code":"EC","alpha3Code":"ECU","callingCode":"593"},{"name":"Egypt","alpha2Code":"EG","alpha3Code":"EGY","callingCode":"20"},{"name":"El Salvador","alpha2Code":"SV","alpha3Code":"SLV","callingCode":"503"},{"name":"Equatorial Guinea","alpha2Code":"GQ","alpha3Code":"GNQ","callingCode":"240"},{"name":"Eritrea","alpha2Code":"ER","alpha3Code":"ERI","callingCode":"291"},{"name":"Estonia","alpha2Code":"EE","alpha3Code":"EST","callingCode":"372"},{"name":"Ethiopia","alpha2Code":"ET","alpha3Code":"ETH","callingCode":"251"},{"name":"Falkland Islands (Malvinas)","alpha2Code":"FK","alpha3Code":"FLK","callingCode":"500"},{"name":"Faroe Islands","alpha2Code":"FO","alpha3Code":"FRO","callingCode":"298"},{"name":"Fiji","alpha2Code":"FJ","alpha3Code":"FJI","callingCode":"679"},{"name":"Finland","alpha2Code":"FI","alpha3Code":"FIN","callingCode":"358"},{"name":"France","alpha2Code":"FR","alpha3Code":"FRA","callingCode":"33"},{"name":"French Guiana","alpha2Code":"GF","alpha3Code":"GUF","callingCode":"594"},{"name":"French Polynesia","alpha2Code":"PF","alpha3Code":"PYF","callingCode":"689"},{"name":"Gabon","alpha2Code":"GA","alpha3Code":"GAB","callingCode":"241"},{"name":"Gambia","alpha2Code":"GM","alpha3Code":"GMB","callingCode":"220"},{"name":"Georgia","alpha2Code":"GE","alpha3Code":"GEO","callingCode":"995"},{"name":"Germany","alpha2Code":"DE","alpha3Code":"DEU","callingCode":"49"},{"name":"Ghana","alpha2Code":"GH","alpha3Code":"GHA","callingCode":"233"},{"name":"Gibraltar","alpha2Code":"GI","alpha3Code":"GIB","callingCode":"350"},{"name":"Greece","alpha2Code":"GR","alpha3Code":"GRC","callingCode":"30"},{"name":"Greenland","alpha2Code":"GL","alpha3Code":"GRL","callingCode":"299"},{"name":"Grenada","alpha2Code":"GD","alpha3Code":"GRD","callingCode":"1473"},{"name":"Guadeloupe","alpha2Code":"GP","alpha3Code":"GLP","callingCode":"590"},{"name":"Guam","alpha2Code":"GU","alpha3Code":"GUM","callingCode":"1671"},{"name":"Guatemala","alpha2Code":"GT","alpha3Code":"GTM","callingCode":"502"},{"name":"Guinea","alpha2Code":"GN","alpha3Code":"GIN","callingCode":"224"},{"name":"Guinea-Bissau","alpha2Code":"GW","alpha3Code":"GNB","callingCode":"245"},{"name":"Guyana","alpha2Code":"GY","alpha3Code":"GUY","callingCode":"592"},{"name":"Haiti","alpha2Code":"HT","alpha3Code":"HTI","callingCode":"509"},{"name":"Holy See","alpha2Code":"VA","alpha3Code":"VAT","callingCode":"379"},{"name":"Honduras","alpha2Code":"HN","alpha3Code":"HND","callingCode":"504"},{"name":"Hong Kong","alpha2Code":"HK","alpha3Code":"HKG","callingCode":"852"},{"name":"Hungary","alpha2Code":"HU","alpha3Code":"HUN","callingCode":"36"},{"name":"Iceland","alpha2Code":"IS","alpha3Code":"ISL","callingCode":"354"},{"name":"India","alpha2Code":"IN","alpha3Code":"IND","callingCode":"91"},{"name":"Indonesia","alpha2Code":"ID","alpha3Code":"IDN","callingCode":"62"},{"name":"Côte d'Ivoire","alpha2Code":"CI","alpha3Code":"CIV","callingCode":"225"},{"name":"Iran (Islamic Republic of)","alpha2Code":"IR","alpha3Code":"IRN","callingCode":"98"},{"name":"Iraq","alpha2Code":"IQ","alpha3Code":"IRQ","callingCode":"964"},{"name":"Ireland","alpha2Code":"IE","alpha3Code":"IRL","callingCode":"353"},{"name":"Israel","alpha2Code":"IL","alpha3Code":"ISR","callingCode":"972"},{"name":"Italy","alpha2Code":"IT","alpha3Code":"ITA","callingCode":"39"},{"name":"Jamaica","alpha2Code":"JM","alpha3Code":"JAM","callingCode":"1876"},{"name":"Japan","alpha2Code":"JP","alpha3Code":"JPN","callingCode":"81"},{"name":"Jordan","alpha2Code":"JO","alpha3Code":"JOR","callingCode":"962"},{"name":"Kazakhstan","alpha2Code":"KZ","alpha3Code":"KAZ","callingCode":"76"},{"name":"Kenya","alpha2Code":"KE","alpha3Code":"KEN","callingCode":"254"},{"name":"Kiribati","alpha2Code":"KI","alpha3Code":"KIR","callingCode":"686"},{"name":"Kuwait","alpha2Code":"KW","alpha3Code":"KWT","callingCode":"965"},{"name":"Kyrgyzstan","alpha2Code":"KG","alpha3Code":"KGZ","callingCode":"996"},{"name":"Lao People's Democratic Republic","alpha2Code":"LA","alpha3Code":"LAO","callingCode":"856"},{"name":"Latvia","alpha2Code":"LV","alpha3Code":"LVA","callingCode":"371"},{"name":"Lebanon","alpha2Code":"LB","alpha3Code":"LBN","callingCode":"961"},{"name":"Lesotho","alpha2Code":"LS","alpha3Code":"LSO","callingCode":"266"},{"name":"Liberia","alpha2Code":"LR","alpha3Code":"LBR","callingCode":"231"},{"name":"Libya","alpha2Code":"LY","alpha3Code":"LBY","callingCode":"218"},{"name":"Liechtenstein","alpha2Code":"LI","alpha3Code":"LIE","callingCode":"423"},{"name":"Lithuania","alpha2Code":"LT","alpha3Code":"LTU","callingCode":"370"},{"name":"Luxembourg","alpha2Code":"LU","alpha3Code":"LUX","callingCode":"352"},{"name":"Macao","alpha2Code":"MO","alpha3Code":"MAC","callingCode":"853"},{"name":"Macedonia (the former Yugoslav Republic of)","alpha2Code":"MK","alpha3Code":"MKD","callingCode":"389"},{"name":"Madagascar","alpha2Code":"MG","alpha3Code":"MDG","callingCode":"261"},{"name":"Malawi","alpha2Code":"MW","alpha3Code":"MWI","callingCode":"265"},{"name":"Malaysia","alpha2Code":"MY","alpha3Code":"MYS","callingCode":"60"},{"name":"Maldives","alpha2Code":"MV","alpha3Code":"MDV","callingCode":"960"},{"name":"Mali","alpha2Code":"ML","alpha3Code":"MLI","callingCode":"223"},{"name":"Malta","alpha2Code":"MT","alpha3Code":"MLT","callingCode":"356"},{"name":"Marshall Islands","alpha2Code":"MH","alpha3Code":"MHL","callingCode":"692"},{"name":"Martinique","alpha2Code":"MQ","alpha3Code":"MTQ","callingCode":"596"},{"name":"Mauritania","alpha2Code":"MR","alpha3Code":"MRT","callingCode":"222"},{"name":"Mauritius","alpha2Code":"MU","alpha3Code":"MUS","callingCode":"230"},{"name":"Mayotte","alpha2Code":"YT","alpha3Code":"MYT","callingCode":"262"},{"name":"Mexico","alpha2Code":"MX","alpha3Code":"MEX","callingCode":"52"},{"name":"Micronesia (Federated States of)","alpha2Code":"FM","alpha3Code":"FSM","callingCode":"691"},{"name":"Moldova (Republic of)","alpha2Code":"MD","alpha3Code":"MDA","callingCode":"373"},{"name":"Monaco","alpha2Code":"MC","alpha3Code":"MCO","callingCode":"377"},{"name":"Mongolia","alpha2Code":"MN","alpha3Code":"MNG","callingCode":"976"},{"name":"Montenegro","alpha2Code":"ME","alpha3Code":"MNE","callingCode":"382"},{"name":"Montserrat","alpha2Code":"MS","alpha3Code":"MSR","callingCode":"1664"},{"name":"Morocco","alpha2Code":"MA","alpha3Code":"MAR","callingCode":"212"},{"name":"Mozambique","alpha2Code":"MZ","alpha3Code":"MOZ","callingCode":"258"},{"name":"Myanmar","alpha2Code":"MM","alpha3Code":"MMR","callingCode":"95"},{"name":"Namibia","alpha2Code":"NA","alpha3Code":"NAM","callingCode":"264"},{"name":"Nauru","alpha2Code":"NR","alpha3Code":"NRU","callingCode":"674"},{"name":"Nepal","alpha2Code":"NP","alpha3Code":"NPL","callingCode":"977"},{"name":"Netherlands","alpha2Code":"NL","alpha3Code":"NLD","callingCode":"31"},{"name":"New Caledonia","alpha2Code":"NC","alpha3Code":"NCL","callingCode":"687"},{"name":"New Zealand","alpha2Code":"NZ","alpha3Code":"NZL","callingCode":"64"},{"name":"Nicaragua","alpha2Code":"NI","alpha3Code":"NIC","callingCode":"505"},{"name":"Niger","alpha2Code":"NE","alpha3Code":"NER","callingCode":"227"},{"name":"Nigeria","alpha2Code":"NG","alpha3Code":"NGA","callingCode":"234"},{"name":"Niue","alpha2Code":"NU","alpha3Code":"NIU","callingCode":"683"},{"name":"Norfolk Island","alpha2Code":"NF","alpha3Code":"NFK","callingCode":"672"},{"name":"Korea (Democratic People's Republic of)","alpha2Code":"KP","alpha3Code":"PRK","callingCode":"850"},{"name":"Northern Mariana Islands","alpha2Code":"MP","alpha3Code":"MNP","callingCode":"1670"},{"name":"Norway","alpha2Code":"NO","alpha3Code":"NOR","callingCode":"47"},{"name":"Oman","alpha2Code":"OM","alpha3Code":"OMN","callingCode":"968"},{"name":"Pakistan","alpha2Code":"PK","alpha3Code":"PAK","callingCode":"92"},{"name":"Palau","alpha2Code":"PW","alpha3Code":"PLW","callingCode":"680"},{"name":"Palestine, State of","alpha2Code":"PS","alpha3Code":"PSE","callingCode":"970"},{"name":"Panama","alpha2Code":"PA","alpha3Code":"PAN","callingCode":"507"},{"name":"Papua New Guinea","alpha2Code":"PG","alpha3Code":"PNG","callingCode":"675"},{"name":"Paraguay","alpha2Code":"PY","alpha3Code":"PRY","callingCode":"595"},{"name":"Peru","alpha2Code":"PE","alpha3Code":"PER","callingCode":"51"},{"name":"Philippines","alpha2Code":"PH","alpha3Code":"PHL","callingCode":"63"},{"name":"Pitcairn","alpha2Code":"PN","alpha3Code":"PCN","callingCode":"64"},{"name":"Poland","alpha2Code":"PL","alpha3Code":"POL","callingCode":"48"},{"name":"Portugal","alpha2Code":"PT","alpha3Code":"PRT","callingCode":"351"},{"name":"Puerto Rico","alpha2Code":"PR","alpha3Code":"PRI","callingCode":"1787"},{"name":"Qatar","alpha2Code":"QA","alpha3Code":"QAT","callingCode":"974"},{"name":"Republic of Kosovo","alpha2Code":"XK","alpha3Code":"KOS","callingCode":"383"},{"name":"Reunion","alpha2Code":"RE","alpha3Code":"REU","callingCode":"262"},{"name":"Romania","alpha2Code":"RO","alpha3Code":"ROU","callingCode":"40"},{"name":"Russian Federation","alpha2Code":"RU","alpha3Code":"RUS","callingCode":"7"},{"name":"Rwanda","alpha2Code":"RW","alpha3Code":"RWA","callingCode":"250"},{"name":"Saint Bartholemy","alpha2Code":"BL","alpha3Code":"BLM","callingCode":"590"},{"name":"Saint Helena, Ascension and Tristan da Cunha","alpha2Code":"SH","alpha3Code":"SHN","callingCode":"290"},{"name":"Saint Kitts and Nevis","alpha2Code":"KN","alpha3Code":"KNA","callingCode":"1869"},{"name":"Saint Lucia","alpha2Code":"LC","alpha3Code":"LCA","callingCode":"1758"},{"name":"Saint Martin (French part)","alpha2Code":"MF","alpha3Code":"MAF","callingCode":"590"},{"name":"Saint Pierre and Miquelon","alpha2Code":"PM","alpha3Code":"SPM","callingCode":"508"},{"name":"Saint Vincent and the Grenadines","alpha2Code":"VC","alpha3Code":"VCT","callingCode":"1784"},{"name":"Samoa","alpha2Code":"WS","alpha3Code":"WSM","callingCode":"685"},{"name":"San Marino","alpha2Code":"SM","alpha3Code":"SMR","callingCode":"378"},{"name":"Sao Tome and Principe","alpha2Code":"ST","alpha3Code":"STP","callingCode":"239"},{"name":"Saudi Arabia","alpha2Code":"SA","alpha3Code":"SAU","callingCode":"966"},{"name":"Senegal","alpha2Code":"SN","alpha3Code":"SEN","callingCode":"221"},{"name":"Serbia","alpha2Code":"RS","alpha3Code":"SRB","callingCode":"381"},{"name":"Seychelles","alpha2Code":"SC","alpha3Code":"SYC","callingCode":"248"},{"name":"Sierra Leone","alpha2Code":"SL","alpha3Code":"SLE","callingCode":"232"},{"name":"Singapore","alpha2Code":"SG","alpha3Code":"SGP","callingCode":"65"},{"name":"Sint Maarten (Dutch part)","alpha2Code":"SX","alpha3Code":"SXM","callingCode":"1721"},{"name":"Slovakia","alpha2Code":"SK","alpha3Code":"SVK","callingCode":"421"},{"name":"Slovenia","alpha2Code":"SI","alpha3Code":"SVN","callingCode":"386"},{"name":"Solomon Islands","alpha2Code":"SB","alpha3Code":"SLB","callingCode":"677"},{"name":"Somalia","alpha2Code":"SO","alpha3Code":"SOM","callingCode":"252"},{"name":"South Africa","alpha2Code":"ZA","alpha3Code":"ZAF","callingCode":"27"},{"name":"South Georgia and the South Sandwich Islands","alpha2Code":"GS","alpha3Code":"SGS","callingCode":"500"},{"name":"Korea (Republic of)","alpha2Code":"KR","alpha3Code":"KOR","callingCode":"82"},{"name":"South Sudan","alpha2Code":"SS","alpha3Code":"SSD","callingCode":"211"},{"name":"Spain","alpha2Code":"ES","alpha3Code":"ESP","callingCode":"34"},{"name":"Sri Lanka","alpha2Code":"LK","alpha3Code":"LKA","callingCode":"94"},{"name":"Sudan","alpha2Code":"SD","alpha3Code":"SDN","callingCode":"249"},{"name":"Suriname","alpha2Code":"SR","alpha3Code":"SUR","callingCode":"597"},{"name":"Svalbard and Jan Mayen","alpha2Code":"SJ","alpha3Code":"SJM","callingCode":"4779"},{"name":"Swaziland","alpha2Code":"SZ","alpha3Code":"SWZ","callingCode":"268"},{"name":"Sweden","alpha2Code":"SE","alpha3Code":"SWE","callingCode":"46"},{"name":"Switzerland","alpha2Code":"CH","alpha3Code":"CHE","callingCode":"41"},{"name":"Syrian Arab Republic","alpha2Code":"SY","alpha3Code":"SYR","callingCode":"963"},{"name":"Taiwan","alpha2Code":"TW","alpha3Code":"TWN","callingCode":"886"},{"name":"Tajikistan","alpha2Code":"TJ","alpha3Code":"TJK","callingCode":"992"},{"name":"Tanzania, United Republic of","alpha2Code":"TZ","alpha3Code":"TZA","callingCode":"255"},{"name":"Thailand","alpha2Code":"TH","alpha3Code":"THA","callingCode":"66"},{"name":"Timor-Leste","alpha2Code":"TL","alpha3Code":"TLS","callingCode":"670"},{"name":"Togo","alpha2Code":"TG","alpha3Code":"TGO","callingCode":"228"},{"name":"Tokelau","alpha2Code":"TK","alpha3Code":"TKL","callingCode":"690"},{"name":"Tonga","alpha2Code":"TO","alpha3Code":"TON","callingCode":"676"},{"name":"Trinidad and Tobago","alpha2Code":"TT","alpha3Code":"TTO","callingCode":"1868"},{"name":"Tunisia","alpha2Code":"TN","alpha3Code":"TUN","callingCode":"216"},{"name":"Turkey","alpha2Code":"TR","alpha3Code":"TUR","callingCode":"90"},{"name":"Turkmenistan","alpha2Code":"TM","alpha3Code":"TKM","callingCode":"993"},{"name":"Turks and Caicos Islands","alpha2Code":"TC","alpha3Code":"TCA","callingCode":"1649"},{"name":"Tuvalu","alpha2Code":"TV","alpha3Code":"TUV","callingCode":"688"},{"name":"Uganda","alpha2Code":"UG","alpha3Code":"UGA","callingCode":"256"},{"name":"Ukraine","alpha2Code":"UA","alpha3Code":"UKR","callingCode":"380"},{"name":"United Arab Emirates","alpha2Code":"AE","alpha3Code":"ARE","callingCode":"971"},{"name":"United Kingdom","alpha2Code":"GB","alpha3Code":"GBR","callingCode":"44"},{"name":"United States","alpha2Code":"US","alpha3Code":"USA","callingCode":"1"},{"name":"Uruguay","alpha2Code":"UY","alpha3Code":"URY","callingCode":"598"},{"name":"Uzbekistan","alpha2Code":"UZ","alpha3Code":"UZB","callingCode":"998"},{"name":"Vanuatu","alpha2Code":"VU","alpha3Code":"VUT","callingCode":"678"},{"name":"Venezuela (Bolivarian Republic of)","alpha2Code":"VE","alpha3Code":"VEN","callingCode":"58"},{"name":"Viet Nam","alpha2Code":"VN","alpha3Code":"VNM","callingCode":"84"},{"name":"Wallis and Futuna","alpha2Code":"WF","alpha3Code":"WLF","callingCode":"681"},{"name":"Western Sahara","alpha2Code":"EH","alpha3Code":"ESH","callingCode":"212"},{"name":"Yemen","alpha2Code":"YE","alpha3Code":"YEM","callingCode":"967"},{"name":"Zambia","alpha2Code":"ZM","alpha3Code":"ZMB","callingCode":"260"},{"name":"Zimbabwe","alpha2Code":"ZW","alpha3Code":"ZWE","callingCode":"263"}];
