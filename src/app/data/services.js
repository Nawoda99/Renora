import {
  Armchair,
  Building2,
  Droplets,
  Hammer,
  Home,
  SparklesIcon,
  Square,
  Truck,
} from "lucide-react";

/** @type {Array<import('./types').CmsService & { icon: any }>} */
export const services = [
  {
    slug: "residential-cleaning",
    icon: Home,
    title: "Hemstädning",
    summary:
      "Noggrann hemstädning anpassad efter dina behov, från löpande underhåll till grundlig storstädning.",
    image:
      "https://images.unsplash.com/photo-1758273238415-01ec03d9ef27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMGhvdXNlJTIwY2xlYW5pbmd8ZW58MXx8fHwxNzcyNzE0NDkyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    overview:
      "Håll ditt hem fräscht, välordnat och trivsamt. Vi lägger fokus på detaljerna som får hemmet att kännas verkligen rent, från kontaktytor till hörn som lätt glöms bort.",
    included: [
      "Dammtorkning och avtorkning av ytor och ofta berörda punkter",
      "Köksstädning (bänkar, vitvarornas utsida, diskho, spishäll)",
      "Badrumsstädning (toalett, dusch eller badkar, handfat, speglar)",
      "Dammsugning och moppning av golv",
      "Tömning av sopor och lätt uppplockning",
    ],
    idealFor: [
      "Veckovis, varannan vecka eller månadsvis städning",
      "Upptagna hushåll som behöver pålitligt underhåll",
      "Lägenheter och villor",
    ],
  },
  {
    slug: "commercial-cleaning",
    icon: Building2,
    title: "Företagsstädning",
    summary:
      "Professionell städning för kontor och kommersiella lokaler så att arbetsmiljön alltid håller hög standard.",
    image:
      "https://images.unsplash.com/photo-1762235634143-6d350fe349e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBjb21tZXJjaWFsJTIwY2xlYW5pbmd8ZW58MXx8fHwxNzcyNjgyOTkzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    overview:
      "En ren arbetsplats stärker produktivitet, professionalism och trivsel. Vi anpassar våra checklistor efter lokal, belastning och era arbetstider.",
    included: [
      "Städning av gemensamma ytor, entré och kontor",
      "Sanering av toaletter och påfyllning vid behov",
      "Städning av pentry och pausutrymmen",
      "Tömning av sopor och återvinning",
      "Golvvård: dammsugning, moppning och fläckborttagning",
    ],
    idealFor: [
      "Kontor, studior, butiker och kliniker",
      "Städning utanför ordinarie öppettider eller med minimal störning",
      "Löpande underhållsavtal",
    ],
  },
  {
    slug: "deep-cleaning",
    icon: SparklesIcon,
    title: "Storstädning",
    summary:
      "Djupgående städning som når varje hörn. Perfekt för säsongsuppfräschning eller inför flytt.",
    image:
      "https://images.unsplash.com/photo-1763705857707-48bbfb24bbd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWVwJTIwY2xlYW5pbmclMjBzZXJ2aWNlfGVufDF8fHx8MTc3MjY4Mjk5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    overview:
      "När ditt hem eller din lokal behöver en nystart tar storstädningen hand om ingrodd smuts och ytor som ofta förbises. Ett perfekt första steg inför regelbunden städning.",
    included: [
      "Noggrann rengöring av badrum och kök",
      "Avtorkning av golvlister, dörrkarmar och strömbrytare",
      "Invändig punktstädning av skåp där det är lämpligt",
      "Extra fokus på hörn, kanter och svåråtkomliga ytor",
      "Detaljstädning av golv längs kanter och under lättare möbler",
    ],
    idealFor: [
      "Säsongsstädning eller vårstädning",
      "Inflyttnings- eller utflyttningsstädning",
      "Inför gäster, högtider eller evenemang",
    ],
  },
  {
    slug: "window-cleaning",
    icon: Square,
    title: "Fönsterputs",
    summary:
      "Skinande rena fönster inne och ute som släpper in mer ljus och ger ett fräschare intryck.",
    image:
      "https://images.unsplash.com/photo-1761689502577-0013be84f1bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5kb3clMjBjbGVhbmluZyUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzI2Nzk5NTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    overview:
      "Ge ditt hem eller din lokal mer ljus med professionell fönsterputs utan ränder. Vi fokuserar på glasets klarhet och rena karmar och fönsterbrädor.",
    included: [
      "Putsning av insidan av glasytor",
      "Putsning av utsidan där det är åtkomligt",
      "Avtorkning av karmar och fönsterbrädor",
      "Dammborttagning från myggnät där det finns",
    ],
    idealFor: [
      "Bostäder och butikslokaler",
      "Säsongsstädning eller inför evenemang",
      "Förbättrat ljusinsläpp och ett bättre helhetsintryck",
    ],
  },
  {
    slug: "carpet-upholstery",
    icon: Armchair,
    title: "Mattor och möbler",
    summary:
      "Professionell rengöring av mattor och möbler för att ta bort fläckar, smuts och allergener.",
    image:
      "https://images.unsplash.com/photo-1762501748150-7fd88647fc2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJwZXQlMjBjbGVhbmluZyUyMHZhY3V1bXxlbnwxfHx8fDE3NzI3MDE2Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    overview:
      "Förläng livslängden på mattor och möbler med en grundlig rengöring som lyfter bort smuts på djupet och fräschar upp textilierna. Metoden anpassas efter material och skick.",
    included: [
      "Fördammsugning och förberedelse av ytan",
      "Riktad behandling av vanliga fläckar där det är lämpligt",
      "Djupgående rengöring av heltäckningsmattor, mattor och stoppade möbler",
      "Luktneutralisering vid behov",
    ],
    idealFor: [
      "Rum och ytor med mycket slitage",
      "Djurägare och hushåll med fokus på allergivänlighet",
      "Uppfräschning av soffor, stolar och mattor",
    ],
  },
  {
    slug: "disinfection-services",
    icon: Droplets,
    title: "Desinfektion",
    summary:
      "Noggrann sanering och desinfektion som hjälper dig att hålla lokaler och hem säkra och hygieniska.",
    image:
      "https://images.unsplash.com/photo-1771491237225-01931a752f58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjbGVhbmluZyUyMHNlcnZpY2UlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcyNjk1ODcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    overview:
      "Desinfektion fokuserar på kontaktytor och gemensamma utrymmen för att minska spridningen av bakterier och virus. Perfekt som återkommande tillägg eller vid särskilda behov.",
    included: [
      "Desinfektion av kontaktytor som handtag, strömbrytare och arbetsytor",
      "Riktad sanering av kök och toaletter",
      "Fokus på gemensamma och ofta använda ytor",
      "Anpassad checklista för din lokal eller bostad",
    ],
    idealFor: [
      "Kontor och delade arbetsytor",
      "Hushåll under förkylnings- och influensasäsong",
      "Återställning efter evenemang eller besök",
    ],
  },
  {
    slug: "move-in-move-out",
    icon: Truck,
    title: "Flyttstädning",
    summary:
      "En detaljerad återställning för tomma bostäder och lägenheter. Perfekt för hyresgäster, fastighetsägare och mäklare.",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80",
    overview:
      "Att flytta är stressigt nog. Vi ser till att städningen inte blir det. Fokus ligger på invändiga ytor, beslag och detaljer så att bostaden känns fräsch inför nästa kapitel.",
    included: [
      "Fullständig städning av kök och badrum",
      "Invändig rengöring av tomma skåp och lådor",
      "Avtorkning av golvlister, dörrar och snickerier",
      "Dammsugning och moppning av golv",
      "Bortforsling av sopor och sista genomgång",
    ],
    idealFor: [
      "Utflytt enligt hyreskrav",
      "Inflytt innan uppackning",
      "Bostäder som ska säljas eller stylas",
    ],
  },
  {
    slug: "post-construction-cleaning",
    icon: Hammer,
    title: "Byggstädning",
    summary:
      "Ta bort byggdamm och rester efter renovering. Vi gör ditt nya utrymme redo att användas och njuta av.",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80",
    overview:
      "Renoveringar lämnar efter sig fint damm som lägger sig överallt. Vi går igenom ytor och golv så att utrymmet känns färdigt, inte som en byggarbetsplats.",
    included: [
      "Borttagning av damm från ytor, lister och armaturer",
      "Dammsugning och moppning av golv med kantfokus",
      "Avtorkning av dörrar, karmar och åtkomliga ventiler",
      "Punktrengöring av färgstänk där det är säkert",
      "Slutfinish på de mest synliga ytorna",
    ],
    idealFor: [
      "Efter renovering av kök eller badrum",
      "Inflyttning i nyproduktion",
      "Kontorsanpassningar och företagsrenoveringar",
    ],
  },
];
