enyo.kind({
	name: "MenuView",
	kind: "View",
	controllerKind: "MenuController",
	layoutKind:"FittableRowsLayout",
	components:[
		{kind:"Scroller", fit:true, components: [
			{classes:"app-title", content:"Let's Play"},
			{style:"box-shadow: inset 0px -5px 10px 0px rgba(0, 0, 0, 0.5);height:5px;"},
			{kind:"Drawer", open:false, components:[
				{kind: "onyx.Groupbox", style:"padding:5%;", components: [
					{kind: "onyx.GroupboxHeader", content: "Active Matches"},
					{kind: "Repeater", count: 0, classes:"active-container", onSetupItem:"controller.setupActiveGames", components: [
						{name:"matchLink", kind:"Link", style:"width:90%; margin:5%;", components:[
							{kind:"onyx.Button", ontap:"controller.switchToGame", classes:"menu-button", components:[
								{name:"lbl1", content:"Game", classes:"menubtn-title"},
								{tag:"br"},
								{name:"lbl2", content:"vs ????", classes:"menubtn-subtitle"}
							]}
						]}
					]}   
				]}
			]},
			{style:"padding:30px;", components:[
				{kind:"onyx.Button", content:"New Match", ontap:"controller.newMatch", classes:"menu-button"},
				{style:"height:15px;"},
				{kind:"onyx.Button", content:"Invite to Play", ontap:"controller.invite", classes:"menu-button"}
			]}
		]},
		{kind:"onyx.Toolbar", style:"padding-top:4px; padding-bottom:4px; height:46px;", allowHtml:true, content:"&nbsp;"}
	]
});
