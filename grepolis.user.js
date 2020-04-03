// ==UserScript==
// @name GrepolisUtils by Ramzes
// @match https://ru80.grepolis.com/game/index*
// @version 04.03.2020.22.06
// @require https://code.jquery.com/jquery-3.4.1.min.js
// @grant unsafeWindow
// @grant GM_openInTab
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
// @grant GM_listValues
// ==/UserScript==

// Полезная фича для отладки jQuery
unsafeWindow.$$$ = $;
console.timelog = function( text ) 
{ 
	var dt = new Date();
	console.log( dt.toString( "HH:MM:SS" ), text ); 
};

ApplyScriptCycle();

function ApplyScriptCycle()
{
	// Обновляем интерфейс.
	RefreshUI();
	
	// Через 500 мс опять вызываем инициализацию скрипта.
	window.setTimeout( ApplyScriptCycle, 1500 );
}

function RefreshUI()
{
	RefreshToolbar();
	RefreshMarketOverviewTab();
	
	
	
	//RefreshTradeTab();
}

///
/// RefreshMarketOverviewTab
///

function RefreshMarketOverviewTab()
{
	if( $( "ul" ).is( "#trade_overview_towns" ) )
	{
		Build_MarketOverviewTab_UI();
		Refresh_MarketOverviewTab_UI();
	}
}

function Build_MarketOverviewTab_UI()
{
	if( $( "span" ).is( "#MarketOverviewTab_beacon" ) )
		return;
	
	// Добавляем маяк рынка на страницу, чтобы повторно не добавлять элементы.
	$( "#trade_selected" ).prepend( $( "<span>" ).css( "display", "none" ).attr( "id", "MarketOverviewTab_beacon" ) );	
	
	
	
	
//#tradetown_165 > div > div.resource_wood_icon.res_icon > span
//#trade_overview_towns > li:nth-child(1)
	
}

function Refresh_MarketOverviewTab_UI()
{
	
	//$( "ul#trade_overview_towns div.trade_town_info > div.res_icon" ).each( function() { var self = $(this); console.log( self );} )
}

///
/// RefreshToolbar
///

function RefreshToolbar()
{
	// Проверяем наличие маяка рынка на странице, чтобы повторно не добавлять элементы.
	var beacon = $( "#toolbar_beacon" );
	
	if( beacon.length > 0 )
		return;
	
	var last_button = $( "#ui_box div.activity_wrap" ).last();
	
	// Если кнопок еще нет, то зайдем попозжа.
	if( last_button.length == 0 )
		return;
	
	// Добавляем маяк тулбара на страницу, чтобы повторно не добавлять элементы.
	last_button.after( $( "<span>" ).css( "display", "none" ).attr( "id", "toolbar_beacon" ) );
	
	var divider_1 = $( "<div>" ).addClass( "divider" );
	var div_villages = 
		$( "<div>" ).addClass( "activity_wrap" ).append
		( 
			$( "<div>" ).addClass( "activity" ).append
			(
				$( "<div>" ).addClass( "hover_state" ).append
				(
					$( "<div>" )
						.addClass( "icon" )
						.css( "background-repeat", "no-repeat" )
						.css( "background-position", "center" ) 
						.css( "background-image", "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAImSURBVDhPxZJLaBNBGMe/mcnuZN2YpInZ2MQYH22ludTSNOmhKAUptJcKPbV4a2+CV0+CJw+eBU8WvQgWD4IHDx68eVSqNCi2SJOGJiGPppvdbnazO04eVqGpCB78XWaY+c1/Xh/8d0ivPYkgQjCFAK7xPm+g0Bn9GzCCOVlEO6kLMkvF3ExygYExesCn2kF/hhtjXor0+fEwy67fZoX1O+zZYpzNnRcZQugxV3DX7H8Fj+Ihzwe89PJ8MsY+Z3ZZrqI2B30COXO4jzZrdrLedF5wr9yWj5J+wndPDEf90wsTUbg+EoTsTgFXimX69msdPuoUqNDZ82JH5hwLYAC5mJ9WJezA5PgoWpq9ClNjQygoETQaOQ3NltPWGh2Z0+8KTvnAWDoX9ik+EbOnbzagUKyiiUsBCFgabJUatXzDvm8z0NpyvwBLt5xsua4v71frMBQ/iz7lVch9zzM/a6KM7nq0VTFe9dz+dcD/ngzIwookuATbakEqQmFzr4FeflE/bBQPb3HF7ponIBB8ZW01bYwECJMpYhEPYR4RtxctdI1f/H4CXifIS93uxOrNmSezESs+SAyQ+DMngiJkKuZd04a1nnsEcovEY7UcU1GU+I2Z6cX0ZDIdDYUSxdcP3S1N9Xm9ss9UNbj3rrSyp9nHAogsUcmxHabpRg1jbKqqWq0caKX89jeLOs0yoVR/v13dVTyuUPiUa5jXialZrO4wMHsZ/wLAD67gxkvXMANQAAAAAElFTkSuQmCC')" )
						.css( "background-size", "contain" )
						.click( DivVillages_Click )
				) 
			)
		);
	
	last_button.after( divider_1 );
	divider_1.after( div_villages );
}

function DivVillages_Click()
{
	window.setTimeout( CollectResources, 100, { "action" : "open_farm_overview" } );
	return false;
}

function CollectResources( data )
{
	if( data.action == "open_farm_overview" )
	{
		FarmTownOverviewWindowFactory.openFarmTownOverview();
		window.setTimeout( CollectResources, 1000, { "action" : "next_village" } );
	}
	else if( data.action == "next_village" )
	{
		var islands = $( "#fto_town_list > li.fto_island" );
		
		if( islands.length > 0 )
		{
			data.action = "switch_to_village";
			data.index = 0;
			data.islands = islands;
			window.setTimeout( CollectResources, 1000, data );
		}
	}
	else if( data.action == "switch_to_village" )
	{
		if( data.index < data.islands.length )
		{
			$( data.islands[data.index] ).next().click();
			data.action = "collect_village";
			window.setTimeout( CollectResources, 1500, data );
		}
		else
		{
			data.action = "close_all";
			window.setTimeout( CollectResources, 1000, data );
		}
	}
	else if( data.action == "collect_village" )
	{
		var button = $( "#fto_claim_button" );
		
		if( button.length > 0 )
		{
			if( button.hasClass( "disabled" ) == false )
				button.click();
			
			data.action = "switch_to_village";
			data.index++;			
			window.setTimeout( CollectResources, 1000, data );			
		}
	}
	else if( data.action == "close_all" )
		$( "#ui_box > div.btn_close_all_windows" ).click();
}

///
/// RefreshTradeTab
///

function IsTradeTab()
{
	return ( $( "#trade_tab" ).length > 0 );
}

function BuildTradeTabUI()
{
	// Проверяем наличие маяка рынка на странице, чтобы повторно не добавлять элементы.
	var beacon = $( "#trade_tab_beacon" );
	
	if( beacon.length > 0 )
		return;
	
	// Добавляем маяк рынка на страницу, чтобы повторно не добавлять элементы.
	$( "#trade_tab" ).prepend( $( "<span>" ).css( "display", "none" ).attr( "id", "trade_tab_beacon" ) );

	// Добавляем ссылку для заполнения склада на 90%.
	var last_resource_selector = $( "#trade > div > div.content > span.resource_selector" ).last();
	last_resource_selector.after( $( "<a>" ).text( "Склад до 90%" ).attr( "alt", "Отправить такое количество ресурсов, чтобы склад был заполнен на 90%." ) );
	last_resource_selector.after( $( "<br>" ) );
}

function RefreshTradeTabUI()
{
	// Вычисляем, сколько могут перенести торговцы
	var span_trade_capacity = $( "#big_progressbar > div.caption > span.value_container > span.curr" );
	var trade_capacity = parseInt( span_trade_capacity.text() );
	
	// Вычисляем емкость склада.
	var span_wh_capacity = $( "#town_capacity_wood > div.amounts > span.max" );
	var wh_capacity = parseInt( span_wh_capacity.text() );
	var wh_capacity_90 = Math.floor( wh_capacity * 0.9 );
	
	// Вычисляем наличные ресурсы в текущем городе, откуда шлем.
	var div_wood_from = $( "#ui_box > div.ui_resources_bar > div.indicator.wood > div.wrapper > div.amount.ui-game-selectable" );
	var wood_amount_from = parseInt( div_wood_from.text() );
	var div_stone_from = $( "#ui_box > div.ui_resources_bar > div.indicator.stone > div.wrapper > div.amount.ui-game-selectable" );
	var stone_amount_from = parseInt( div_stone_from.text() );
	var div_iron_from = $( "#ui_box > div.ui_resources_bar > div.indicator.iron > div.wrapper > div.amount.ui-game-selectable" );
	var iron_amount_from = parseInt( div_iron_from.text() );
	
	// Вычисляем количество ресурсов в городе, куда шлем.
	var span_wood_amount_to = $( "#town_capacity_wood > div.amounts > span.curr" );
	var span_wood_amount_to_with_trade = $( "#town_capacity_wood > div.amounts > span.curr4" );
	var wood_amount_to = parseInt( span_wood_amount_to_with_trade.text() == "" ? span_wood_amount_to.text() : span_wood_amount_to_with_trade.text().substring( 3 ) );
	var span_stone_amount_to = $( "#town_capacity_stone > div.amounts > span.curr" );
	var span_stone_amount_to_with_trade = $( "#town_capacity_stone > div.amounts > span.curr4" );
	var stone_amount_to = parseInt( span_stone_amount_to_with_trade.text() == "" ? span_stone_amount_to.text() : span_stone_amount_to_with_trade.text().substring( 3 ) );
	var span_iron_amount_to = $( "#town_capacity_iron > div.amounts > span.curr" );
	var span_iron_amount_to_with_trade = $( "#town_capacity_iron > div.amounts > span.curr4" );
	var iron_amount_to = parseInt( span_iron_amount_to_with_trade.text() == "" ? span_iron_amount_to.text() : span_iron_amount_to_with_trade.text().substring( 3 ) );

	// Вычисляем сколько ресурсов послать
	var wood_to_send = 0;
	var stone_to_send = 0;
	var iron_to_send = 0;
	
	var trade_capacity_remain = trade_capacity;
	
	if( trade_capacity_remain > 0 )
	{
		wood_to_send = Math.min( trade_capacity_remain, wood_amount_from, Math.max( 0, wh_capacity_90 - wood_amount_to ) );
	}


	$( "#trade_type_wood > div.body > input[type=text]" ).focus().val( wood_to_send ).change().focusout();
	$( "#trade_type_stone > div.body > input[type=text]" ).focus().click();


	
	
	console.info( "trade_capacity: " + trade_capacity );
	console.info( "wh_capacity: " + wh_capacity );
	console.info( "wh_capacity_90: " + wh_capacity_90 );
	console.info( "wood_amount_from: " + wood_amount_from );
	console.info( "stone_amount_from: " + stone_amount_from );
	console.info( "iron_amount_from: " + iron_amount_from );
	console.info( "wood_amount_to: " + wood_amount_to );
	console.info( "stone_amount_to: " + stone_amount_to );
	console.info( "iron_amount_to: " + iron_amount_to );
	console.info( "wood_to_send: " + wood_to_send );
	console.info( "stone_to_send: " + stone_to_send );
	console.info( "iron_to_send: " + iron_to_send );
}

function RefreshTradeTab()
{
	if( IsTradeTab() )
	{
		// Инициализируем дополнительный интерфейс на рынке.
		BuildTradeTabUI();
		
		// Обновляем 
		RefreshTradeTabUI();
	}
}
