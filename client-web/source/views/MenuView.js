enyo.kind({
	name: "MenuView",
	kind: "View",
	controllerKind: "MenuController",
	layoutKind:"FittableRowsLayout",
	components:[
		{fit:true, components: [
			{style:"font-size: 2em; color:silver; padding: 10px 10px 10px 30px;", content:"Let's Play"},
			{tag:"hr", style:"margin-bottom:5px;"},
			{kind:"Drawer", open:false, components:[
				{kind: "onyx.Groupbox", components: [
					{kind: "onyx.GroupboxHeader", content: "Active Matches"},
					{kind: "Repeater", count: 0, onSetupItem:"controller.setupActiveGames", components: [
						{kind:"onyx.Button", ontap:"openMatch", components:[
							{name:"lbl1", content:"Game", classes:"menubtn-title"},
							{tag:"br"},
							{name:"lbl2", content:"vs ????", classes:"menubtn-subtitle"}
						]}
					]}   
				]}
			]},
			{style:"padding:30px;", components:[
				{kind:"onyx.Button", content:"New Match", ontap:"controller.newMatch", style:"width:100%; background-color:#4c4c4c; color: lightgray;"},
				{style:"height:15px;"},
				{kind:"onyx.Button", content:"Invite to Play", ontap:"controller.invite", style:"width:100%; background-color:#4c4c4c; color: lightgray;"}
			]}
		]},
		{kind:"onyx.Toolbar", style:"padding-top:4px; padding-bottom:4px; height:46px;", allowHtml:true, content:"&nbsp;"}
	]
});
