//
// Define the 'app' module.
//
var app = angular.module('app', ['ngRoute', 'controllers', 'flowChart', 'ui-notification', 'pascalprecht.translate', 'dndLists', 'ngFlatDatepicker', 'angularMoment', 'hmTouchEvents', 'ui.ace', 'selector']);
//set init VISUALFORCE
app.value('VISUALFORCE', {});

//configuration
app.config(function($sceDelegateProvider) {
	$sceDelegateProvider.resourceUrlWhitelist(['**']);
});


app.config(['$routeProvider', '$locationProvider' ,
	function ($routeProvider, $locationProvider) {

		$locationProvider.html5Mode({
			enabled: false,
			requireBase: false
		});

		$routeProvider.
		when('/detail/', {
			title: 'Detail',
			templateUrl: '/partials/detail.html',
			controller: 'appCtrl',
			reloadOnSearch:false
		}).
		when('/list/', {
			title: 'List',
			templateUrl: '/partials/list.html',
			controller: 'appCtrl',
		}).
		otherwise({
			redirectTo:function(routeParams,path, search){
				var ids = window.location.search.match(new RegExp('(?:[\?\&]id=)([^&]+)'));
				return ids ? '/detail/?id='+ids[1] : '/list/'}
		});


	}]);




app.factory('httpRequestInterceptor', ['VISUALFORCE', function (VISUALFORCE) {
return {
	//server templates from local or remote
	request: function (config) {
		if (config.method === 'GET' && config.url.indexOf('.html') != -1 && config.url.indexOf('selector/') == -1) {
			if (typeof Visualforce != "undefined") {
				config.url = (VISUALFORCE.resource_nbcf || '') + config.url;
			}
		}
		return config;
	}
}
}]);

app.config(['$httpProvider', function ($httpProvider) {
	$httpProvider.interceptors.push('httpRequestInterceptor');
}]);

app.config(['NotificationProvider', function(NotificationProvider) {
	NotificationProvider.setOptions({
		delay: 3000,
		startTop: 2,
		startRight: 10,
		verticalSpacing: 20,
		horizontalSpacing: 20,
		positionX: 'center',
		positionY: 'top',
		templateUrl: '/partials/notification.html',
		replaceMessage: true
	});
}]);

app.config(['$translateProvider', function ($translateProvider) {

	//apply translations
	$translateProvider.translations('en_GB', {
		"AUTO": "Use default",
        "DA-DK_ANNA_AI" :"Danish (DK): Anna-AI",
        "DA-DK_MADS" :"Danish (DK): Mads",
        "DA-DK_NAJA" :"Danish (DK): Naja",
        "NL-NL_FLEUR_AI" :"Dutch (NL): Fleur-AI",
        "NL_LOTTE":"Dutch (NL): Lotte",
        "NL-NL_RUBEN" :"Dutch (NL): Ruben",
        "NL_SASKIA":"Dutch (NL): Saskia", // obsolete
        "NL_WILLEM":"Dutch (NL): Willem", // obsolete
        "EN-AU_AMELIA_AI" :"English (AU): Amelia-AI",
		"EN_NICOLE":"English (AU): Nicole",
        "EN-AU_NOAH_AI" :"English (AU): Noah-AI",
        "EN-AU_OLIVIA_AI" :"English (AU): Olivia-AI",
		"EN_RUSSELL":"English (AU): Russell",
        "EN-AU_WILLIAM_AI" :"English (AU): William-AI",
        "EN-GB_AMY" :"English (GB): Amy",
        "EN-GB_BRIAN" :"English (GB): Brian",
		"EN_EMMA":"English (GB): Emma",
        "EN-GB_HANNAH_AI" :"English (GB): Hannah-AI",
		"EN_KATE":"English (GB): Kate", // obsolete
        "EN-GB_LEWIS_AI" :"English (GB): Lewis-AI",
        "EN-GB_LUCY_AI" :"English (GB): Lucy-AI",
		"EN_SIMON":"English (GB): Simon", // obsolete
        "EN-GB_THOMAS_AI" :"English (GB): Thomas-AI",
        "EN-IN_ADITI" :"English (IN): Aditi",
        "EN-IN_RAVEENA" :"English (IN): Raveena",
		"EN_CHIPMUNK":"English (US): Chipmunk", // obsolete
        "EN-US_EMILY_AI" :"English (US): Emily-AI",
		"EN_ERIC":"English (US): Eric", // obsolete
        "EN-US_EVELYN_AI" :"English (US): Evelyn-AI",
		"EN_IVY":"English (US): Ivy",
		"EN_JENNIFER":"English (US): Jennifer", // obsolete
        "EN-US_JOANNA" :"English (US): Joanna",
		"EN_JOEY":"English (US): Joey",
        "EN-US_JUSTIN" :"English (US): Justin",
		"EN_KENDRA":"English (US): Kendra",
		"EN_KIMBERLY":"English (US): Kimberly",
        "EN-US_LIAM_AI" :"English (US): Liam-AI",
        "EN-US_MATTHEW" :"English (US): Matthew",
        "EN-US_MICHAEL_AI" :"English (US): Michael-AI",
        "EN-US_OLIVER_AI" :"English (US): Oliver-AI",
		"EN_SALLI":"English (US): Salli",
        "EN-US_SOPHIA_AI" :"English (US): Sophia-AI",
		"FR_CA_CHANTAL":"French (CA): Chantal",
        "FR-CA_FELIX_AI" :"French (CA): Felix-AI",
        "FR-CA_FLORENCE_AI" :"French (CA): Florence-AI",
        "FR-CA_JULIETTE_AI" :"French (CA): Juliette-AI",
        "FR-CA_RAPHAEL_AI" :"French (CA): Raphael-AI",
        "FR-FR_ADELE_AI" :"French (FR): Adele-AI",
		"FR_CELINE":"French (FR): Celine",
        "FR-FR_CURTIS_AI" :"French (FR): Curtis-AI",
        "FR-FR_DANIELLE_AI" :"French (FR): Danielle-AI",
        "FR-FR_JASPER_AI" :"French (FR): Jasper-AI",
        "FR-FR_LEA" :"French (FR): Lea",
		"FR_MATHIEU":"French (FR): Mathieu",
        "DE-DE_ELIAS_AI" :"German (DE): Elias-AI",
        "DE-DE_ERIKA_AI" :"German (DE): Erika-AI",
		"DE_HANS":"German (DE): Hans",
        "DE-DE_LEONIE_AI" :"German (DE): Leonie-AI",
		"DE_MARLENE":"German (DE): Marlene",
        "DE-DE_MARTINA_AI" :"German (DE): Martina-AI",
        "DE-DE_OSKAR_AI" :"German (DE): Oskar-AI",
        "DE-DE_VICKI" :"German (DE): Vicki",
        "HI-IN_ADITI" :"Hindi (IN): Aditi",
		"IS_DORA":"Icelandic (IS): Dora",
		"IS_KARL":"Icelandic (IS): Karl",
        "IT-IT_BIANCA" :"Italian (IT): Bianca",
		"IT_CARLA":"Italian (IT): Carla",
		"IT_GIORGIO":"Italian (IT): Giorgio",
        "JA-JP_KANNA_AI" :"Japanese (JP): Kanna-AI",
        "JA-JP_MIZUKI" :"Japanese (JP): Mizuki",
        "JA-JP_TAKUMI" :"Japanese (JP): Takumi",
        "KO-KR_HYUN_AI" :"Korean (KR): Hyun-AI",
        "KO-KR_JI-SU_AI" :"Korean (KR): Ji-Su-AI",
        "KO-KR_KWAN_AI" :"Korean (KR): Kwan-AI",
        "KO-KR_SEO-YUN_AI" :"Korean (KR): Seo-Yun-AI",
        "KO-KR_SEOYEON" :"Korean (KR): Seoyeon",
        "CMN-CN_ZHIYU" :"Mandarin (CN): Zhiyu",
        "NB-NO_ANITA_AI" :"Norwegian (NO): Anita-AI",
		"NB_NO_LIV":"Norwegian (NO): Liv",
		"PL_AGNIESZKA":"Polish (PL): Agnieszka", // obsolete
        "PL-PL_ANTONI_AI" :"Polish (PL): Antoni-AI",
        "PL-PL_DOMINIK_AI" :"Polish (PL): Dominik-AI",
        "PL-PL_ELENA_AI" :"Polish (PL): Elena-AI",
		"PL_EWA":"Polish (PL): Ewa",
        "PL-PL_IGA_AI" :"Polish (PL): Iga-AI",
		"PL_JACEK":"Polish (PL): Jacek",
		"PL_JAN":"Polish (PL): Jan",
		"PL_MAJA":"Polish (PL): Maja",
        "PL-PL_MONIKA_AI" :"Polish (PL): Monika-AI",
		"PT_BR_RICARDO":"Portuguese (BR): Ricardo",
		"PT_BR_VITORIA":"Portuguese (BR): Vitoria",
        "PT-BR_IZABEL_AI" :"Portuguese (BR): Izabel-AI",
        "PT-PT_ADRIANO_AI" :"Portuguese (PT): Adriano-AI",
        "PT-PT_CRISTIANO" :"Portuguese (PT): Cristiano",
        "PT-PT_INES" :"Portuguese (PT): Ines",
        "PT-PT_JERONIMO_AI" :"Portuguese (PT): Jeronimo-AI",
        "PT-PT_MARISSA_AI" :"Portuguese (PT): Marissa-AI",
        "PT-PT_ROSA_AI" :"Portuguese (PT): Rosa-AI",
		"RO_CARMEN":"Romanian (RO): Carmen",
        "RU-RU_GENNADI_AI" :"Russian (RU): Gennadi-AI",
        "RU-RU_IVAN_AI" :"Russian (RU): Ivan-AI",
        "RU-RU_MAXIM" :"Russian (RU): Maxim",
        "RU-RU_NATASHA_AI" :"Russian (RU): Natasha-AI",
        "RU-RU_TANYA_AI" :"Russian (RU): Tanya-AI",
		"RU_TATYANA":"Russian (RU): Tatyana",
        "SK-SK_NINA_AI" :"Slovak (SK): Nina-AI",
		"ES_CONCHITA":"Spanish (ES): Conchita",
		"ES_ENRIQUE":"Spanish (ES): Enrique",
        "ES-ES_LUCIA" :"Spanish (ES): Lucia",
        "ES-ES_VALERIA_AI" :"Spanish (ES): Valeria-AI",
        "ES-MX_MIA" :"Spanish (MX): Mia",
		"ES_US_MIGUEL":"Spanish (US): Miguel",
        "ES-US_PENELOPE" :"Spanish (US): Penelope",
		"SV_SE_ASTRID":"Swedish (SE): Astrid",
        "SV-SE_ELSA_AI" :"Swedish (SE): Elsa-AI",
        "TR-TR_AYLA_AI" :"Turkish (TR): Ayla-AI",
		"TR_FILIZ":"Turkish (TR): Filiz",
        "TR-TR_NESRIN_AI" :"Turkish (TR): Nesrin-AI",
        "TR-TR_OMER_AI" :"Turkish (TR): Omer-AI",
        "TR-TR_YESIM_AI" :"Turkish (TR): Yesim-AI",
        "TR-TR_YUSEF_AI" :"Turkish (TR): Yusef-AI",
        "UK-UA_LIZA_AI"  :"Ukrainian (UA): Liza-AI",
		"CY_GERAINT":"Welsh (GB): Geraint",
		"CY_GWYNETH":"Welsh (GB): Gwyneth",

        "zh" : "Chinese",
        "zh-CN" : "Chinese (China)",
        "zh-TW" : "Chinese (Taiwan)",
        "nl" : "Dutch",
        "en" : "English",
        "en-AU" : "English (Australia)",
        "en-IN" : "English (India)",
        "en-NZ" : "English (New Zealand)",
        "en-GB" : "English (UK)",
        "en-US" : "English (US)",
        "fr" : "French",
        "fr-CA" : "French (Canada)",
        "de" : "German",
        "hi" : "Hindi",
        "hi-Latn" : "Hindi (Roman Script)",
        "id" : "Indonesian",
        "it" : "Italian",
        "ja" : "Japanese",
        "ko" : "Korean",
        "pt" : "Portuguese",
        "pt-BR" : "Portuguese (Brazil)",
        "pt-PT" : "Portuguese (Portugal)",
        "ru" : "Russian",
        "es" : "Spanish",
        "es-419" : "Spanish (Latin America)",
        "sv" : "Swedish",
        "tr" : "Turkish",
        "uk" : "Ukrainian",

        "RECORDS_FOUND" : "Record found",
		"NEVER" : "Never trigger",

		"RECORD_CREATED" : "Record created",
		"RECORD_UPDATED" : "Record updated",

		"ASC" : "Ascending",
		"DESC" : "Descending",


		"RECORDS_FOUND" : "Records found",
		"RECORDS_NOT_FOUND" : "Records not found",
		"SF_ERROR" : "Error returned",
		"RECORD_CREATED" : "Record created",
		"RECORD_UPDATED" : "Record updated",

		"CALL_CONNECTED" : "Call is connected",
		"CALL_NOT_CONNECTED": "Call is not connected",
		"CAMP_EXIT" : "Camp Exit",

		"NUMBER" : "Phone Number",
		"DIVERT" : "Divert",
		"DDI_USER": "DDI User",
		"USER" : "User",
		"GROUP" : "Group",
		"REQUESTED" : "Requested Number",

		"RING_TONE" : "Ring tone",
		"MUSIC" : "Music",

		"moh://default" : "Default",
		"moh://classical" : "Classical",
		"moh://african" : "African",
		"moh://blues" : "Blues",
		"moh://disco" : "Disco",
		"moh://funky" : "Funky",
		"moh://jazz" : "Jazz",
		"moh://modern" : "Modern",

		"VAR_DIALLED_NUMBER" : "Dialled Number",
		"RM_DIALLED_NUMBER" : "Extension Number",
		"VAR_PIN_NUMBER" : "Pin Number",
		"BUILTIN" : "Built In",
		"MACRO" : "Macro",

		"timeOfDay": "Time of day",
		"countryCode": "Country code",
		"callerIdWithheld": "Caller Id",
		"numberMatch" : "Number match",
		"evaluate": "Evaluate",
		"LONGEST_IDLE": "Longest Idle",
		"SEQUENTIAL": "Sequential",
		"LEAST_TALK": "Least Talk",
		"LEAST_CALLS": "Least Calls",
		"ALL_AGENTS": "All Agents",

		"POLICY_TYPE_CALL": "Call",
		"POLICY_TYPE_DATA_ANALYTICS" : "Data Analytics",
		"POLICY_NO_GLOBAL_LICENSE" : "There is no License Information available.",
		"POLICY_BAD_CALLBACK_DURATION" : "The CallBack attempt duration is outside the allowed interval.",
		"TAG" : "Sound file",
		"TTS" : "Text To Speech",
		"SOUND_TONE" : "Tone",
		"SOUND_MP3" : "MP3",
		"SOUND_SHOUTCAST" : "SHOUTcast",
	});
	$translateProvider.preferredLanguage('en_GB');
}]);

