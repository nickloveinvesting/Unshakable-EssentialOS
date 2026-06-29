import React, { useState, useCallback, useMemo, useEffect, useRef, useContext, createContext } from 'react';
import { Construction, TrendingUp, Inbox, SlidersHorizontal, Landmark, BarChart2, Table, Mail, Info, ChevronDown, Bookmark, Share2, Save, Printer, Download, Trash2, X, Calculator, Sparkles, FolderOpen, Edit3, FileText, Calendar, Target, Award, AlertTriangle, CheckCircle, CheckCircle2, Clock, DollarSign, Layers, Activity, Shield, Zap, Compass, MapPin, Home, Trophy, Check, LogOut, Lock, User } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL=import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY=import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase=createClient(SUPABASE_URL,SUPABASE_ANON_KEY);

const View = { Home:'home', RehabEstimator:'rehabEstimatorView', StrategyAnalyzer:'strategyAnalyzerView', FinancingProfit:'financingProfitView', DealScore:'dealScoreView' };
const STORAGE_KEYS = { currentDeal:'unshakable.tools.currentDeal', savedDeals:'unshakable.tools.savedDeals', preferences:'unshakable.tools.preferences' };

const FINANCING_DEFAULTS_2026 = {
    hardMoney:{rate:0.11,points:0.02,ltvPurchase:0.85,ltvArvCap:0.70,ltc:0.85,termMonths:12,tiers:{experienced:{rate:0.0975,points:0.015,ltvPurchase:0.90,arv:0.75},moderate:{rate:0.1125,points:0.02,ltvPurchase:0.85,arv:0.70},firstTimer:{rate:0.12,points:0.025,ltvPurchase:0.80,arv:0.65}}},
    dscr:{rate:0.0725,rateBestTier:0.0625,points:0.0125,ltvPurchase:0.75,ltvCashOutRefi:0.75,ltvRateTermRefi:0.80,minDSCR:1.25,minDSCRQualify:1.00,seasoningMonthsCashOut:6,reservesMonthsPITIA:6},
    conventionalCashOutRefi:{rate:0.08,points:0.01,ltvCap:0.75,seasoningMonths:12,closingCostPct:0.03},
    transactionalFunding:{feePct:0.02,minFee:1000,processingFee:500},
    subjectTo:{legalSetupCost:2000,annualMaintenance:300,txWrapDisclosureDays:7,txWrapRescissionDays:21},
    benchmarks2026:{medianFlipROI:0.255,q4FlipROI:0.236,medianGrossProfit:65981,avgHoldTimeDays:160,cashPurchasePct:0.62},
    closingCosts:{purchasePct:0.03,salePctNonCommission:0.015,saleCommissionPct:0.06,saleAllInPct:0.075,refiPct:0.03},
    holdingCosts:{propertyTaxAnnualPct:0.01,insuranceMonthlyVacant:325,insuranceMonthlyOccupied:225,utilitiesMonthlyRehab:175,utilitiesMonthlyOccupied:350,hoaMonthlyDefault:0,hoaMonthlyWhenEnabled:250}
};

const NATIONAL_BENCHMARKS = {medianPricePerSqft:224,medianDOM:55,flipROI:25.5,medianRent3BR:2100,dataAsOf:'2026-Q1'};

const METRO_BENCHMARKS = {
'New York-Newark-Jersey City, NY, NJ, PA':{medianPricePerSqft:620,medianDOM:70,flipROI:25.5,medianRent3BR:4500},
'Los Angeles-Long Beach-Anaheim, CA':{medianPricePerSqft:595,medianDOM:50,flipROI:18,medianRent3BR:4500},
'Chicago-Naperville-Elgin, IL, IN, WI':{medianPricePerSqft:200,medianDOM:45,flipROI:50,medianRent3BR:2350},
'Dallas-Fort Worth-Arlington, TX':{medianPricePerSqft:199,medianDOM:70,flipROI:4.6,medianRent3BR:2295},
'Houston-The Woodlands-Sugar Land, TX':{medianPricePerSqft:174,medianDOM:67,flipROI:5.1,medianRent3BR:1890},
'Miami-Fort Lauderdale-Pompano Beach, FL':{medianPricePerSqft:350,medianDOM:95,flipROI:25.5,medianRent3BR:3200},
'Philadelphia-Camden-Wilmington, PA, NJ, DE, MD':{medianPricePerSqft:185,medianDOM:67,flipROI:60,medianRent3BR:2150},
'Atlanta-Sandy Springs-Alpharetta, GA':{medianPricePerSqft:190,medianDOM:68,flipROI:25.5,medianRent3BR:2200},
'Washington-Arlington-Alexandria, DC, VA, MD, WV':{medianPricePerSqft:474,medianDOM:45,flipROI:25.5,medianRent3BR:3100},
'Boston-Cambridge-Newton, MA, NH':{medianPricePerSqft:675,medianDOM:33,flipROI:50,medianRent3BR:4200},
'Phoenix-Mesa-Chandler, AZ':{medianPricePerSqft:265,medianDOM:58,flipROI:13,medianRent3BR:2300},
'San Francisco-Oakland-Berkeley, CA':{medianPricePerSqft:1000,medianDOM:49,flipROI:12,medianRent3BR:5200},
'Riverside-San Bernardino-Ontario, CA':{medianPricePerSqft:337,medianDOM:60,flipROI:20,medianRent3BR:3000},
'Detroit-Warren-Dearborn, MI':{medianPricePerSqft:145,medianDOM:39,flipROI:80,medianRent3BR:1800},
'Seattle-Tacoma-Bellevue, WA':{medianPricePerSqft:428,medianDOM:32,flipROI:20,medianRent3BR:3500},
'Minneapolis-St. Paul-Bloomington, MN, WI':{medianPricePerSqft:220,medianDOM:41,flipROI:35,medianRent3BR:2200},
'San Diego-Chula Vista-Carlsbad, CA':{medianPricePerSqft:592,medianDOM:28,flipROI:15,medianRent3BR:3950},
'Tampa-St. Petersburg-Clearwater, FL':{medianPricePerSqft:254,medianDOM:47,flipROI:15,medianRent3BR:2630},
'Denver-Aurora-Lakewood, CO':{medianPricePerSqft:275,medianDOM:70,flipROI:18,medianRent3BR:2809},
'Baltimore-Columbia-Towson, MD':{medianPricePerSqft:175,medianDOM:32,flipROI:60,medianRent3BR:2300},
'St. Louis, MO, IL':{medianPricePerSqft:170,medianDOM:33,flipROI:55,medianRent3BR:1695},
'Orlando-Kissimmee-Sanford, FL':{medianPricePerSqft:215,medianDOM:54,flipROI:15,medianRent3BR:2240},
'Charlotte-Concord-Gastonia, NC, SC':{medianPricePerSqft:219,medianDOM:55,flipROI:25.5,medianRent3BR:2060},
'San Antonio-New Braunfels, TX':{medianPricePerSqft:173,medianDOM:86,flipROI:6.5,medianRent3BR:1793},
'Portland-Vancouver-Hillsboro, OR, WA':{medianPricePerSqft:313,medianDOM:73,flipROI:22,medianRent3BR:2117},
'Sacramento-Roseville-Folsom, CA':{medianPricePerSqft:331,medianDOM:24,flipROI:18,medianRent3BR:2594},
'Pittsburgh, PA':{medianPricePerSqft:178,medianDOM:68,flipROI:103.6,medianRent3BR:1986},
'Austin-Round Rock-Georgetown, TX':{medianPricePerSqft:236,medianDOM:58,flipROI:4.1,medianRent3BR:2389},
'Las Vegas-Henderson-Paradise, NV':{medianPricePerSqft:250,medianDOM:75,flipROI:15,medianRent3BR:2350},
'Cincinnati, OH, KY, IN':{medianPricePerSqft:181,medianDOM:51,flipROI:60,medianRent3BR:1700},
'Kansas City, MO, KS':{medianPricePerSqft:183,medianDOM:58,flipROI:40,medianRent3BR:1900},
'Columbus, OH':{medianPricePerSqft:203,medianDOM:59,flipROI:50,medianRent3BR:1850},
'Cleveland-Elyria, OH':{medianPricePerSqft:110,medianDOM:33,flipROI:75,medianRent3BR:1650},
'Indianapolis-Carmel-Anderson, IN':{medianPricePerSqft:165,medianDOM:49,flipROI:45,medianRent3BR:1850},
'San Jose-Sunnyvale-Santa Clara, CA':{medianPricePerSqft:783,medianDOM:15,flipROI:10,medianRent3BR:3993},
'Nashville-Davidson--Murfreesboro--Franklin, TN':{medianPricePerSqft:260,medianDOM:88,flipROI:18,medianRent3BR:2300},
'Virginia Beach-Norfolk-Newport News, VA, NC':{medianPricePerSqft:218,medianDOM:32,flipROI:35,medianRent3BR:2100},
'Providence-Warwick, RI, MA':{medianPricePerSqft:270,medianDOM:53,flipROI:60,medianRent3BR:2400},
'Milwaukee-Waukesha, WI':{medianPricePerSqft:165,medianDOM:45,flipROI:55,medianRent3BR:1900},
'Jacksonville, FL':{medianPricePerSqft:184,medianDOM:67,flipROI:18,medianRent3BR:2050}
};

const METRO_DATA = [
{metro:"New York-Newark-Jersey City, NY, NJ, PA",multiplier:1.252,lat:40.7128,lon:-74.0060,region:'northeast'},
{metro:"Los Angeles-Long Beach-Anaheim, CA",multiplier:1.233,lat:34.0522,lon:-118.2437,region:'west'},
{metro:"Chicago-Naperville-Elgin, IL, IN, WI",multiplier:1.024,lat:41.8781,lon:-87.6298,region:'midwest'},
{metro:"Dallas-Fort Worth-Arlington, TX",multiplier:1.005,lat:32.7767,lon:-96.7970,region:'southwest'},
{metro:"Houston-The Woodlands-Sugar Land, TX",multiplier:0.946,lat:29.7604,lon:-95.3698,region:'southwest'},
{metro:"Miami-Fort Lauderdale-Pompano Beach, FL",multiplier:1.119,lat:25.7617,lon:-80.1918,region:'southeast'},
{metro:"Philadelphia-Camden-Wilmington, PA, NJ, DE, MD",multiplier:1.037,lat:39.9526,lon:-75.1652,region:'northeast'},
{metro:"Atlanta-Sandy Springs-Alpharetta, GA",multiplier:0.957,lat:33.7490,lon:-84.3880,region:'southeast'},
{metro:"Washington-Arlington-Alexandria, DC, VA, MD, WV",multiplier:1.157,lat:38.9072,lon:-77.0369,region:'northeast'},
{metro:"Boston-Cambridge-Newton, MA, NH",multiplier:1.137,lat:42.3601,lon:-71.0589,region:'northeast'},
{metro:"Phoenix-Mesa-Chandler, AZ",multiplier:0.999,lat:33.4484,lon:-112.0740,region:'southwest'},
{metro:"San Francisco-Oakland-Berkeley, CA",multiplier:1.299,lat:37.7749,lon:-122.4194,region:'west'},
{metro:"Riverside-San Bernardino-Ontario, CA",multiplier:1.096,lat:34.0560,lon:-117.4050,region:'west'},
{metro:"Detroit-Warren-Dearborn, MI",multiplier:0.916,lat:42.3314,lon:-83.0458,region:'midwest'},
{metro:"Seattle-Tacoma-Bellevue, WA",multiplier:1.168,lat:47.6062,lon:-122.3321,region:'west'},
{metro:"Minneapolis-St. Paul-Bloomington, MN, WI",multiplier:1.006,lat:44.9778,lon:-93.2650,region:'midwest'},
{metro:"San Diego-Chula Vista-Carlsbad, CA",multiplier:1.168,lat:32.7157,lon:-117.1611,region:'west'},
{metro:"Tampa-St. Petersburg-Clearwater, FL",multiplier:1.002,lat:27.9641,lon:-82.4524,region:'southeast'},
{metro:"Denver-Aurora-Lakewood, CO",multiplier:1.056,lat:39.7392,lon:-104.9903,region:'southwest'},
{metro:"Baltimore-Columbia-Towson, MD",multiplier:1.066,lat:39.2904,lon:-76.6122,region:'northeast'},
{metro:"St. Louis, MO, IL",multiplier:0.89,lat:38.6270,lon:-90.1994,region:'midwest'},
{metro:"Orlando-Kissimmee-Sanford, FL",multiplier:0.993,lat:28.5383,lon:-81.3792,region:'southeast'},
{metro:"Charlotte-Concord-Gastonia, NC, SC",multiplier:0.948,lat:35.2271,lon:-80.8431,region:'southeast'},
{metro:"San Antonio-New Braunfels, TX",multiplier:0.916,lat:29.4241,lon:-98.4936,region:'southwest'},
{metro:"Portland-Vancouver-Hillsboro, OR, WA",multiplier:1.054,lat:45.5051,lon:-122.6750,region:'west'},
{metro:"Sacramento-Roseville-Folsom, CA",multiplier:1.077,lat:38.5816,lon:-121.4944,region:'west'},
{metro:"Pittsburgh, PA",multiplier:0.914,lat:40.4406,lon:-79.9959,region:'northeast'},
{metro:"Austin-Round Rock-Georgetown, TX",multiplier:1.011,lat:30.2672,lon:-97.7431,region:'southwest'},
{metro:"Las Vegas-Henderson-Paradise, NV",multiplier:0.996,lat:36.1699,lon:-115.1398,region:'southwest'},
{metro:"Cincinnati, OH, KY, IN",multiplier:0.914,lat:39.1031,lon:-84.5120,region:'midwest'},
{metro:"Kansas City, MO, KS",multiplier:0.93,lat:39.0997,lon:-94.5786,region:'midwest'},
{metro:"Columbus, OH",multiplier:0.929,lat:39.9612,lon:-82.9988,region:'midwest'},
{metro:"Cleveland-Elyria, OH",multiplier:0.912,lat:41.4993,lon:-81.6944,region:'midwest'},
{metro:"Indianapolis-Carmel-Anderson, IN",multiplier:0.903,lat:39.7684,lon:-86.1581,region:'midwest'},
{metro:"San Jose-Sunnyvale-Santa Clara, CA",multiplier:1.303,lat:37.3382,lon:-121.8863,region:'west'},
{metro:"Nashville-Davidson--Murfreesboro--Franklin, TN",multiplier:0.958,lat:36.1627,lon:-86.7816,region:'southeast'},
{metro:"Virginia Beach-Norfolk-Newport News, VA, NC",multiplier:0.97,lat:36.8529,lon:-75.9780,region:'southeast'},
{metro:"Providence-Warwick, RI, MA",multiplier:1.033,lat:41.8240,lon:-71.4128,region:'northeast'},
{metro:"Milwaukee-Waukesha, WI",multiplier:0.948,lat:43.0389,lon:-87.9065,region:'midwest'},
{metro:"Jacksonville, FL",multiplier:0.985,lat:30.3322,lon:-81.6557,region:'southeast'}
];

const REHAB_ITEMS = [
{id:'int_paint',category:'General Interior',name:'Interior Painting (Walls & Trim)',type:'sqft',cost:4.55,areaType:'percentage'},
{id:'flooring_lvp',category:'General Interior',name:'Flooring Installation (LVP)',type:'sqft',cost:6.05,areaType:'percentage'},
{id:'flooring_carpet',category:'General Interior',name:'Carpet Installation',type:'sqft',cost:5,areaType:'percentage'},
{id:'hardwood_refinish',category:'General Interior',name:'Hardwood Floor Refinishing',type:'sqft',cost:6,areaType:'percentage'},
{id:'baseboard',category:'General Interior',name:'Baseboard & Trim Installation',type:'sqft',cost:2.5,areaType:'percentage'},
{id:'deep_clean',category:'General Interior',name:'Deep Cleaning',type:'onetime',cost:1000},
{id:'light_fixtures',category:'General Interior',name:'Light Fixture Replacement',type:'item',cost:250,label:'fixtures'},
{id:'outlets_switches',category:'General Interior',name:'Outlets & Switches Replacement',type:'onetime',cost:25},
{id:'door_hardware',category:'General Interior',name:'Door Hardware Replacement',type:'onetime',cost:500},
{id:'int_door',category:'General Interior',name:'Interior Door Replacement',type:'item',cost:460,label:'doors'},
{id:'popcorn_removal',category:'General Interior',name:'Popcorn Ceiling Removal',type:'sqft',cost:4.6,areaType:'percentage'},
{id:'attic_insulation',category:'General Interior',name:'Attic Insulation (Blown-in)',type:'onetime',cost:6000},
{id:'ext_paint',category:'General Exterior',name:'Exterior Painting',type:'sqft',cost:3.75,areaType:'percentage'},
{id:'landscaping',category:'General Exterior',name:'Landscaping Cleanup & Mulching',type:'onetime',cost:1650},
{id:'entry_door',category:'General Exterior',name:'Entry Door Replacement (Steel)',type:'onetime',cost:2500},
{id:'window_replace',category:'General Exterior',name:'Window Replacement (Vinyl)',type:'item',cost:600,label:'windows'},
{id:'siding_vinyl',category:'General Exterior',name:'Siding Replacement (Vinyl)',type:'sqft',cost:13.00,areaType:'percentage'},
{id:'gutters',category:'General Exterior',name:'Gutter Installation',type:'linear_ft',cost:5,label:'linear ft'},
{id:'garage_door',category:'General Exterior',name:'Garage Door Replacement',type:'onetime',cost:2530},
{id:'deck_repair',category:'General Exterior',name:'Deck Repair',type:'onetime',cost:5800},
{id:'deck_add',category:'General Exterior',name:'Deck Addition (Wood)',type:'onetime',cost:13500},
{id:'fence_install',category:'General Exterior',name:'Fence Installation (Wood)',type:'linear_ft',cost:52,label:'linear ft'},
{id:'driveway_seal',category:'General Exterior',name:'Driveway Sealing (Asphalt)',type:'onetime',cost:1050},
{id:'stone_veneer',category:'General Exterior',name:'Manufactured Stone Veneer Accent',type:'onetime',cost:2200},
{id:'hvac',category:'Major Systems & Utilities',name:'HVAC System Replacement',type:'onetime',cost:10350},
{id:'water_heater',category:'Major Systems & Utilities',name:'Water Heater Replacement',type:'onetime',cost:1500},
{id:'roof',category:'Major Systems & Utilities',name:'Roof Replacement (Asphalt)',type:'onetime',cost:20000},
{id:'elec_panel',category:'Major Systems & Utilities',name:'Electrical Panel Upgrade',type:'onetime',cost:2875},
{id:'foundation_repair',category:'Major Systems & Utilities',name:'Foundation Repair (Piers)',type:'onetime',cost:5000},
{id:'pest_control',category:'Major Systems & Utilities',name:'Pest Control (General)',type:'onetime',cost:460},
{id:'termite',category:'Major Systems & Utilities',name:'Termite Treatment',type:'onetime',cost:2070},
{id:'sump_pump',category:'Major Systems & Utilities',name:'Sump Pump Installation',type:'onetime',cost:1610},
{id:'security_sys',category:'Major Systems & Utilities',name:'Security System Installation',type:'onetime',cost:1500},
{id:'smart_thermostat',category:'Major Systems & Utilities',name:'Smart Thermostat Installation',type:'onetime',cost:430},
{id:'garage_opener',category:'Major Systems & Utilities',name:'Garage Door Opener Installation',type:'onetime',cost:1000},
{id:'k_demo_cosmetic',category:'Kitchen Remodel',name:'Demolition (Cosmetic)',type:'onetime',cost:1500},
{id:'k_demo_studs',category:'Kitchen Remodel',name:'Demolition to Studs',type:'onetime',cost:3500},
{id:'k_framing',category:'Kitchen Remodel',name:'Structural & Framing (Layout Change)',type:'onetime',cost:4500},
{id:'k_mep_overhaul',category:'Kitchen Remodel',name:'Full MEP Overhaul (New Wiring & Plumbing)',type:'onetime',cost:6000},
{id:'k_insulation',category:'Kitchen Remodel',name:'Insulation & Drywall Installation',type:'sqft',cost:3.5,areaType:'percentage'},
{id:'k_cabinet_paint',category:'Kitchen Remodel',name:'Cabinet Painting',type:'onetime',cost:2250},
{id:'k_cabinets_low',category:'Kitchen Remodel',name:'New Cabinets (Low-Grade)',type:'onetime',cost:5000},
{id:'k_cabinets_mid',category:'Kitchen Remodel',name:'New Cabinets (Mid-Grade)',type:'onetime',cost:9500},
{id:'k_counter_entry',category:'Kitchen Remodel',name:'Countertops (Entry-Level Quartz)',type:'onetime',cost:3800},
{id:'k_counter_mid',category:'Kitchen Remodel',name:'Countertops (Mid-Grade Quartz)',type:'onetime',cost:5500},
{id:'k_appliances',category:'Kitchen Remodel',name:'Appliance Package (3-Piece Stainless)',type:'onetime',cost:3700},
{id:'k_backsplash',category:'Kitchen Remodel',name:'Tile Backsplash Installation',type:'onetime',cost:(35+37.5)/2*30},
{id:'k_sink_faucet',category:'Kitchen Remodel',name:'Kitchen Sink & Faucet Replacement',type:'onetime',cost:865},
{id:'k_disposal',category:'Kitchen Remodel',name:'Garbage Disposal Installation',type:'onetime',cost:430},
{id:'k_mep_updates',category:'Kitchen Remodel',name:'MEP Updates (GFCI, valves, etc.)',type:'onetime',cost:650},
{id:'b_demo_cosmetic',category:'Bathroom Remodel',name:'Demolition (Cosmetic)',type:'onetime',cost:1800},
{id:'b_demo_studs',category:'Bathroom Remodel',name:'Demolition to Studs',type:'onetime',cost:2500},
{id:'b_framing',category:'Bathroom Remodel',name:'Structural & Framing (Layout Change)',type:'onetime',cost:3000},
{id:'b_mep_overhaul',category:'Bathroom Remodel',name:'Full MEP Overhaul (New Wiring & Plumbing)',type:'onetime',cost:7500},
{id:'b_insulation',category:'Bathroom Remodel',name:'Insulation & Drywall Installation',type:'onetime',cost:3500},
{id:'b_reglaze',category:'Bathroom Remodel',name:'Bathtub/Shower Reglazing',type:'onetime',cost:550},
{id:'b_tub_combo',category:'Bathroom Remodel',name:'Tub/Shower Combo Replacement',type:'onetime',cost:5175},
{id:'b_tile',category:'Bathroom Remodel',name:'Tile Installation (Floor & Walls)',type:'onetime',cost:4500},
{id:'b_vanity',category:'Bathroom Remodel',name:'Bathroom Vanity & Top Replacement',type:'onetime',cost:1380},
{id:'b_toilet',category:'Bathroom Remodel',name:'Toilet Replacement',type:'onetime',cost:520},
{id:'b_fixtures',category:'Bathroom Remodel',name:'Fixtures, Mirror & Lighting',type:'onetime',cost:1500},
{id:'b_mep_updates',category:'Bathroom Remodel',name:'MEP Updates (GFCI, valves, etc.)',type:'onetime',cost:1125}
];

const itemGroups = {
'grouped_k_demo':{name:'Kitchen Demolition',default:'k_demo_cosmetic',options:['k_demo_cosmetic','k_demo_studs']},
'grouped_k_cabinets':{name:'New Cabinets',default:'k_cabinets_mid',options:['k_cabinets_low','k_cabinets_mid']},
'grouped_k_countertops':{name:'Countertops',default:'k_counter_entry',options:['k_counter_entry','k_counter_mid']},
'grouped_b_demo':{name:'Bathroom Demolition',default:'b_demo_cosmetic',options:['b_demo_cosmetic','b_demo_studs']}
};

const rehabItemMap = REHAB_ITEMS.reduce((a,i)=>{a[i.id]=i;return a;},{});

const TRADE_METADATA = {
'int_paint':{trade:'interior_paint',durationDays:4,predecessors:['drywall'],crewSize:2},
'flooring_lvp':{trade:'flooring',durationDays:3,predecessors:['interior_paint'],crewSize:2},
'flooring_carpet':{trade:'flooring',durationDays:1,predecessors:['interior_paint','trim'],crewSize:2},
'hardwood_refinish':{trade:'flooring',durationDays:5,predecessors:['interior_paint'],crewSize:2},
'baseboard':{trade:'trim',durationDays:2,predecessors:['flooring'],crewSize:1},
'deep_clean':{trade:'punch',durationDays:1,predecessors:['interior_paint','flooring','trim','plumbing_fixtures','electrical_fixtures'],crewSize:2},
'light_fixtures':{trade:'electrical_fixtures',durationDays:1,predecessors:['interior_paint'],crewSize:1},
'outlets_switches':{trade:'electrical_fixtures',durationDays:1,predecessors:['interior_paint'],crewSize:1},
'door_hardware':{trade:'trim',durationDays:1,predecessors:['int_door','interior_paint'],crewSize:1},
'int_door':{trade:'trim',durationDays:1,predecessors:['interior_paint'],crewSize:1},
'popcorn_removal':{trade:'demo',durationDays:3,predecessors:['demo'],crewSize:2},
'attic_insulation':{trade:'insulation',durationDays:1,predecessors:[],crewSize:2},
'ext_paint':{trade:'exterior_paint',durationDays:4,predecessors:['siding','windows'],crewSize:2,weather:true},
'landscaping':{trade:'landscaping',durationDays:2,predecessors:[],crewSize:2,weather:true},
'entry_door':{trade:'windows',durationDays:1,predecessors:['framing'],crewSize:1,weather:true,fabLagDays:14},
'window_replace':{trade:'windows',durationDays:1,predecessors:['framing','roof'],crewSize:2,weather:true,fabLagDays:21},
'siding_vinyl':{trade:'siding',durationDays:5,predecessors:['windows'],crewSize:2,weather:true,fabLagDays:14},
'gutters':{trade:'siding',durationDays:1,predecessors:['roof','siding'],crewSize:1,weather:true},
'garage_door':{trade:'exterior_paint',durationDays:1,predecessors:['framing'],crewSize:2},
'deck_repair':{trade:'exterior_paint',durationDays:3,predecessors:[],crewSize:1,weather:true},
'deck_add':{trade:'exterior_paint',durationDays:5,predecessors:[],crewSize:2,weather:true},
'fence_install':{trade:'landscaping',durationDays:3,predecessors:[],crewSize:2,weather:true},
'driveway_seal':{trade:'landscaping',durationDays:1,predecessors:[],crewSize:1,weather:true},
'stone_veneer':{trade:'siding',durationDays:2,predecessors:['framing'],crewSize:1,weather:true},
'hvac':{trade:'mep_rough',durationDays:2,predecessors:['framing'],crewSize:1},
'water_heater':{trade:'plumbing_fixtures',durationDays:1,predecessors:['mep_rough'],crewSize:1},
'roof':{trade:'roof',durationDays:2,predecessors:[],crewSize:2,weather:true,fabLagDays:7},
'elec_panel':{trade:'mep_rough',durationDays:1,predecessors:['demo'],crewSize:1},
'foundation_repair':{trade:'foundation',durationDays:4,predecessors:[],crewSize:1,weather:true},
'pest_control':{trade:'foundation',durationDays:1,predecessors:['demo'],crewSize:1},
'termite':{trade:'foundation',durationDays:1,predecessors:['demo'],crewSize:1},
'sump_pump':{trade:'foundation',durationDays:1,predecessors:['foundation_repair'],crewSize:1},
'security_sys':{trade:'punch',durationDays:1,predecessors:['interior_paint','electrical_fixtures'],crewSize:1},
'smart_thermostat':{trade:'hvac_final',durationDays:1,predecessors:['hvac'],crewSize:1},
'garage_opener':{trade:'hvac_final',durationDays:1,predecessors:['garage_door'],crewSize:1},
'k_demo_cosmetic':{trade:'demo',durationDays:1,predecessors:[],crewSize:1},
'k_demo_studs':{trade:'demo',durationDays:3,predecessors:[],crewSize:2},
'k_framing':{trade:'framing',durationDays:3,predecessors:['demo'],crewSize:1},
'k_mep_overhaul':{trade:'mep_rough',durationDays:5,predecessors:['framing'],crewSize:2},
'k_insulation':{trade:'drywall',durationDays:7,predecessors:['mep_rough'],crewSize:2},
'k_cabinet_paint':{trade:'cabinets',durationDays:3,predecessors:['interior_paint'],crewSize:1},
'k_cabinets_low':{trade:'cabinets',durationDays:2,predecessors:['interior_paint','flooring'],crewSize:2,fabLagDays:7},
'k_cabinets_mid':{trade:'cabinets',durationDays:3,predecessors:['interior_paint','flooring'],crewSize:2,fabLagDays:35},
'k_counter_entry':{trade:'countertops',durationDays:1,predecessors:['cabinets'],crewSize:1,fabLagDays:12},
'k_counter_mid':{trade:'countertops',durationDays:1,predecessors:['cabinets'],crewSize:1,fabLagDays:12},
'k_appliances':{trade:'appliances',durationDays:1,predecessors:['countertops'],crewSize:1,fabLagDays:10},
'k_backsplash':{trade:'backsplash',durationDays:2,predecessors:['countertops'],crewSize:1},
'k_sink_faucet':{trade:'plumbing_fixtures',durationDays:1,predecessors:['countertops'],crewSize:1},
'k_disposal':{trade:'plumbing_fixtures',durationDays:1,predecessors:['k_sink_faucet'],crewSize:1},
'k_mep_updates':{trade:'electrical_fixtures',durationDays:1,predecessors:['interior_paint'],crewSize:1},
'b_demo_cosmetic':{trade:'demo',durationDays:1,predecessors:[],crewSize:1},
'b_demo_studs':{trade:'demo',durationDays:2,predecessors:[],crewSize:1},
'b_framing':{trade:'framing',durationDays:2,predecessors:['demo'],crewSize:1},
'b_mep_overhaul':{trade:'mep_rough',durationDays:5,predecessors:['framing'],crewSize:2},
'b_insulation':{trade:'drywall',durationDays:5,predecessors:['mep_rough'],crewSize:1},
'b_reglaze':{trade:'tile',durationDays:1,predecessors:['demo'],crewSize:1},
'b_tub_combo':{trade:'tile',durationDays:2,predecessors:['mep_rough'],crewSize:1},
'b_tile':{trade:'tile',durationDays:5,predecessors:['drywall','mep_rough'],crewSize:1},
'b_vanity':{trade:'cabinets',durationDays:1,predecessors:['tile','interior_paint'],crewSize:1},
'b_toilet':{trade:'plumbing_fixtures',durationDays:1,predecessors:['tile'],crewSize:1},
'b_fixtures':{trade:'plumbing_fixtures',durationDays:1,predecessors:['tile','b_vanity'],crewSize:1},
'b_mep_updates':{trade:'electrical_fixtures',durationDays:1,predecessors:['interior_paint'],crewSize:1}
};

const CREW_MULTIPLIERS = {1:1.0,2:0.85,3:0.70,4:0.60};
const CREW_LABELS = {1:'Solo GC / DIY',2:'GC + Active Subs',3:'Pro Crew',4:'Volume Operator'};
const WEATHER_BUFFERS = {
northeast:{winter:0.20,spring:0.10,summer:0.05,fall:0.10},
midwest:{winter:0.20,spring:0.10,summer:0.05,fall:0.10},
southeast:{winter:0.05,spring:0.05,summer:0.10,fall:0.05},
southwest:{winter:0.05,spring:0.05,summer:0.05,fall:0.05},
west:{winter:0.10,spring:0.05,summer:0.05,fall:0.05}
};

const COACHING_LIBRARY = {
lowMargin:"Net profit under $30K on a deal this size is not worth the risk. You make money on the purchase. Drop the offer or walk.",
highLeverage:"You are at 90%+ of ARV in total cost basis. Lenders will not fund this. Cut acquisition or scope before you sign anything.",
cost70Rule:"Total cost basis is over 70% of ARV. The deal is broken before you start. Re-run with a lower offer or pivot to hold.",
strongMargin:"Net profit clears $50K and the rehab is in medium range. This is a fundable deal. Lock the contractor and call your lender.",
majorSystems:"Foundation, roof, or full panel work shows up in this scope. MEPs are where rookies lose money. Get itemized contractor bids before you trust this number.",
rehabUnderbid:"Your rehab is well under typical $/sqft for this metro. Either you have a unicorn contractor or you missed scope. Verify before you make the offer."
};

const COACHING_RULES = [
{test:(m)=>m.sqft>0&&m.rehabPerSqft<20&&m.rehabPerSqft>0,message:()=>COACHING_LIBRARY.rehabUnderbid},
{test:(m)=>m.sqft>0&&m.rehabPerSqft>90,message:(m)=>`Rehab is at $${Math.round(m.rehabPerSqft)}/sqft. ${COACHING_LIBRARY.majorSystems}`},
{test:(m)=>m.profitMargin>0&&m.profitMargin<10,message:()=>COACHING_LIBRARY.lowMargin},
{test:(m)=>m.profitMargin>=20,message:()=>COACHING_LIBRARY.strongMargin},
{test:(m)=>m.costBasisOfArv>80,message:()=>COACHING_LIBRARY.cost70Rule},
{test:(m)=>m.costBasisOfArv>90,message:()=>COACHING_LIBRARY.highLeverage},
{test:(m)=>m.netProfit<0,message:()=>COACHING_LIBRARY.lowMargin}
];

const QUICK_SCOPE_PRESETS = {
cosmetic:{name:'Cosmetic Refresh',description:'Paint, flooring, fixtures. Typical $15 to $25 per sqft.',items:['int_paint','flooring_lvp','baseboard','deep_clean','light_fixtures','outlets_switches','door_hardware','ext_paint','landscaping','smart_thermostat'],percentages:{int_paint:'100',flooring_lvp:'100',baseboard:'100',ext_paint:'100'},quantities:{light_fixtures:'8'},bathsToRemodel:'0'},
midGrade:{name:'Mid-Grade Flip',description:'Cosmetic plus kitchen plus 1 bath remodel. Typical $55 to $75 per sqft.',items:['int_paint','flooring_lvp','baseboard','deep_clean','light_fixtures','outlets_switches','door_hardware','ext_paint','landscaping','smart_thermostat','int_door','popcorn_removal','entry_door','hvac','water_heater','k_insulation','k_appliances','k_backsplash','k_sink_faucet','k_mep_updates','b_insulation','b_tub_combo','b_tile','b_vanity','b_toilet','b_fixtures','b_mep_updates','grouped_k_demo','grouped_k_cabinets','grouped_k_countertops','grouped_b_demo'],percentages:{int_paint:'100',flooring_lvp:'100',baseboard:'100',ext_paint:'100',popcorn_removal:'100',k_insulation:'15'},quantities:{light_fixtures:'8',int_door:'6'},qualities:{grouped_k_demo:'k_demo_cosmetic',grouped_k_cabinets:'k_cabinets_mid',grouped_k_countertops:'k_counter_entry',grouped_b_demo:'b_demo_cosmetic'},bathsToRemodel:'1'},
fullGut:{name:'Full Gut',description:'Complete renovation including major systems, roof, siding, 2 baths. Typical $120 to $160 per sqft.',items:['int_paint','flooring_lvp','baseboard','deep_clean','light_fixtures','outlets_switches','door_hardware','ext_paint','landscaping','smart_thermostat','int_door','popcorn_removal','entry_door','hvac','water_heater','k_framing','k_mep_overhaul','k_insulation','k_appliances','k_backsplash','k_sink_faucet','k_mep_updates','b_framing','b_mep_overhaul','b_insulation','b_tile','b_vanity','b_toilet','b_fixtures','b_mep_updates','window_replace','siding_vinyl','garage_door','roof','elec_panel','foundation_repair','attic_insulation','grouped_k_demo','grouped_k_cabinets','grouped_k_countertops','grouped_b_demo'],percentages:{int_paint:'100',flooring_lvp:'100',baseboard:'100',ext_paint:'100',popcorn_removal:'100',siding_vinyl:'100',k_insulation:'15'},quantities:{light_fixtures:'12',int_door:'8',window_replace:'10'},qualities:{grouped_k_demo:'k_demo_studs',grouped_k_cabinets:'k_cabinets_mid',grouped_k_countertops:'k_counter_mid',grouped_b_demo:'b_demo_studs'},bathsToRemodel:'2'}
};

// Shared month calculation — single source of truth for hold period across all tabs
const getProjectMonths = (deal) => {
    const ganttDays = deal.computedDurationDays || 90;
    const rehabMonths = Math.max(ganttDays / 30, 1);
    // Total project = rehab + 2 months closing/listing buffer, floor 4 months
    const totalProjectMonths = Math.max(rehabMonths + 2, 4);
    return { rehabMonths, totalProjectMonths, ganttDays };
};

const formatCurrencySimple = (n)=>{if(isNaN(n)||!isFinite(n))return '$0';return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:0,maximumFractionDigits:0}).format(Math.round(n));};
const formatCurrency = (v,p=false)=>{if(isNaN(v)||!isFinite(v))return '$0';return v.toLocaleString('en-US',{style:'currency',currency:'USD',minimumFractionDigits:p?2:0,maximumFractionDigits:p?2:0});};
const formatPct = (v,d=1)=>{if(isNaN(v)||!isFinite(v))return 'N/A';return `${v.toFixed(d)}%`;};

const getDealMetrics = (arv,purchasePrice,rehabCosts,fp,sqft,extraCosts,deal) => {
    const {ltv,interestRate,holdingPeriod} = fp;
    // Use shared month calc when deal context available, else fall back to user holdingPeriod
    const projectMonths = deal ? getProjectMonths(deal) : null;
    const months = projectMonths ? projectMonths.totalProjectMonths : holdingPeriod;
    const sellingCosts = arv*0.075;
    const closingCosts = purchasePrice*0.03;
    const totalCostBasis = purchasePrice+rehabCosts;
    const loanAmount = totalCostBasis*(ltv/100);
    const loanPoints = loanAmount*0.02;
    const financingCosts = loanAmount*(interestRate/100/12)*months+loanPoints;
    const totalExtraCosts = (extraCosts||[]).reduce((a,c)=>a+(parseFloat(c.amount)||0),0);
    const totalHoldingCosts = sellingCosts+financingCosts+closingCosts+totalExtraCosts;
    const totalProjectCost = purchasePrice+rehabCosts+totalHoldingCosts;
    const netProfit = arv-totalProjectCost;
    const downPayment = totalCostBasis-loanAmount;
    const acquisitionCost = closingCosts+downPayment;
    const roi = acquisitionCost>0?(netProfit/acquisitionCost)*100:Infinity;
    const costBasisOfArv = arv>0?(totalCostBasis/arv)*100:0;
    const profitMargin = arv>0?(netProfit/arv)*100:0;
    const arvPerSqft = sqft>0?arv/sqft:0;
    const purchasePricePerSqft = sqft>0?purchasePrice/sqft:0;
    const rehabPerSqft = sqft>0?rehabCosts/sqft:0;
    const loanToArv = arv>0?(loanAmount/arv)*100:0;
    return {arv,purchasePrice,rehabCosts,sellingCosts,closingCosts,loanAmount,loanPoints,financingCosts,totalHoldingCosts,totalProjectCost,netProfit,acquisitionCost,roi,downPayment,totalCostBasis,ltv,costBasisOfArv,profitMargin,arvPerSqft,purchasePricePerSqft,rehabPerSqft,totalExtraCosts,loanToArv,sqft,holdingMonths:months};
};

const safeGet = (k,f)=>{try{const r=localStorage.getItem(k);if(!r)return f;return JSON.parse(r);}catch(e){return f;}};
const safeSet = (k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}};

const mapRow = (r)=>({id:r.id,name:r.deal_name,savedAt:r.created_at,...(r.inputs||{})});
const useSavedDeals = () => {
    const [deals,setDeals] = useState([]);
    const refresh = useCallback(async()=>{const {data,error}=await supabase.from('deals').select('*').order('created_at',{ascending:false});if(!error&&data)setDeals(data.map(mapRow));},[]);
    useEffect(()=>{(async()=>{const {data:{user}}=await supabase.auth.getUser();if(!user)return;try{const migrated=localStorage.getItem('unshakable.tools.migrated');const local=safeGet(STORAGE_KEYS.savedDeals,[]);if(!migrated&&Array.isArray(local)&&local.length){for(const d of local){await supabase.from('deals').insert({user_id:user.id,deal_name:d.name||d.address||'Imported deal',address:d.address||null,arv:parseFloat(d.arv)||d.arvNum||null,purchase_price:parseFloat(d.purchasePrice)||d.purchasePriceNum||null,net_profit:Number.isFinite(d.netProfit)?d.netProfit:null,inputs:d,result:{roi:d.roi}});}localStorage.setItem('unshakable.tools.migrated','1');}}catch(e){}await refresh();})();},[refresh]);
    const saveDeal = useCallback(async(d,n)=>{const {data:{user}}=await supabase.auth.getUser();if(!user)return null;const payload={user_id:user.id,deal_name:n||d.address||'Untitled Deal',address:d.address||null,arv:parseFloat(d.arv)||null,purchase_price:parseFloat(d.purchasePrice)||null,net_profit:Number.isFinite(d.netProfit)?d.netProfit:null,verdict:d.verdict||null,inputs:d,result:{roi:d.roi,netProfit:d.netProfit}};const {data}=await supabase.from('deals').insert(payload).select().single();await refresh();return data?mapRow(data):null;},[refresh]);
    const deleteDeal = useCallback(async(id)=>{await supabase.from('deals').delete().eq('id',id);await refresh();},[refresh]);
    const loadDeal = useCallback((id)=>deals.find(d=>d.id===id)||null,[deals]);
    return {deals,saveDeal,deleteDeal,loadDeal,refresh};
};

const encodeDealToUrl = (d)=>{try{const j=JSON.stringify(d);const u=unescape(encodeURIComponent(j));return btoa(u);}catch(e){return '';}};
const decodeDealFromUrl = (sp)=>{try{const e=sp.get('deal');if(!e)return null;const u=atob(e);const j=decodeURIComponent(escape(u));return JSON.parse(j);}catch(e){return null;}};

const DEFAULT_DEAL = {
address:'',zip:'',sqft:'',beds:'',baths:'',
metroDisplay:'',metroMultiplier:1.0,metroRegion:'midwest',stateAbbr:'',
selectedItems:{},itemQuantities:{},itemPercentages:{},selectedQualities:{},customItems:{},
bathsToRemodel:'1',totalRehabCost:0,rehabEstimation:0,finalEstimation:0,
arv:'',purchasePrice:'',targetProfit:'',
ltv:'75',interestRate:'11',holdingPeriod:'6',extraCosts:[],
selectedStrategy:'flip',selectedSubScenario:'market',
userCashAvailable:'100000',creditTier:'1-3deals',riskTolerance:'balanced',
sellerMortgageBalance:'',sellerMortgageRate:'',sellerFreeAndClear:false,
estimatedRent:'',targetAssignmentFee:'15000',
projectStartDate:'',crewSize:1,weatherBuffer:true,weekendWork:false,
computedDurationDays:0,selectedFinancingScenario:'hardMoneyStandard'
};

const DealContext = createContext(null);
const DealProvider = ({children}) => {
    const initialDeal = useMemo(()=>{
        try {const p=new URLSearchParams(window.location.search);const fu=decodeDealFromUrl(p);if(fu)return {...DEFAULT_DEAL,...fu};}catch(e){}
        const fs=safeGet(STORAGE_KEYS.currentDeal,null);
        if(fs)return {...DEFAULT_DEAL,...fs};
        return DEFAULT_DEAL;
    },[]);
    const [deal,setDeal]=useState(initialDeal);
    const pt=useRef(null);
    useEffect(()=>{if(pt.current)cancelAnimationFrame(pt.current);pt.current=requestAnimationFrame(()=>safeSet(STORAGE_KEYS.currentDeal,deal));return ()=>pt.current&&cancelAnimationFrame(pt.current);},[deal]);
    const updateDeal = useCallback((p)=>{setDeal(pr=>(typeof p==='function'?p(pr):{...pr,...p}));},[]);
    const replaceDeal = useCallback((n)=>setDeal({...DEFAULT_DEAL,...n}),[]);
    const resetDeal = useCallback(()=>setDeal(DEFAULT_DEAL),[]);
    const value=useMemo(()=>({deal,updateDeal,replaceDeal,resetDeal}),[deal,updateDeal,replaceDeal,resetDeal]);
    return <DealContext.Provider value={value}>{children}</DealContext.Provider>;
};
const useDeal = () => {const c=useContext(DealContext);if(!c)throw new Error('useDeal must be used within DealProvider');return c;};

const ToastContext = createContext(null);
const ToastProvider = ({children}) => {
    const [toast,setToast]=useState(null);
    const show=useCallback((m)=>setToast({id:Date.now(),message:m}),[]);
    useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(null),2400);return ()=>clearTimeout(t);},[toast]);
    return (<ToastContext.Provider value={{show}}>{children}<div className={`toast ${toast?'show':''}`} role="status" aria-live="polite">{toast?.message}</div></ToastContext.Provider>);
};
const useToast = () => useContext(ToastContext);

const getDistance = (lat1,lon1,lat2,lon2) => {
    const R=6371;const dLat=(lat2-lat1)*Math.PI/180;const dLon=(lon2-lon1)*Math.PI/180;
    const a=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);
    return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
};

const computeRehabCost = (deal) => {
    const sqft=parseFloat(deal.sqft)||0;
    const numBathsToRemodel=parseFloat(deal.bathsToRemodel)||1;
    const multiplier=deal.metroMultiplier||1.0;
    let totalRehabCost=0;
    const itemizedList=[];
    Object.keys(deal.selectedItems||{}).forEach(id=>{
        if(!deal.selectedItems[id])return;
        let item,itemName;
        if(id.startsWith('grouped_')){
            const selOpt=(deal.selectedQualities||{})[id]||itemGroups[id]?.default;
            item=rehabItemMap[selOpt];if(!item)return;
            const ql=item.name.match(/\(([^)]+)\)/)?.[1]||'';
            itemName=`${itemGroups[id].name} (${ql.trim()})`;
        } else {item=rehabItemMap[id];itemName=item?.name;}
        if(!item)return;
        let ibc=0;
        switch(item.type){
            case 'onetime':ibc=item.cost;break;
            case 'sqft':if(item.areaType==='percentage'){const pct=parseFloat((deal.itemPercentages||{})[item.id]||'100');ibc=item.cost*sqft*(pct/100);}else{ibc=item.cost*sqft;}break;
            case 'item':case 'linear_ft':{const qty=parseFloat((deal.itemQuantities||{})[item.id]||'1');ibc=item.cost*qty;break;}
        }
        let fibc=ibc;
        if(item.category==='Bathroom Remodel'){fibc*=numBathsToRemodel;if(numBathsToRemodel>1)itemName+=` (x${numBathsToRemodel})`;}
        totalRehabCost+=fibc;
        itemizedList.push({name:itemName,cost:fibc*multiplier,id});
    });
    Object.values(deal.customItems||{}).flat().forEach((item)=>{const c=parseFloat(item.cost)||0;totalRehabCost+=c;if(c>0)itemizedList.push({name:item.name||'Custom Item',cost:c*multiplier});});
    const rehabEstimation=totalRehabCost*multiplier;
    const finalEstimation=rehabEstimation*1.10;
    return {itemizedList,totalRehabCost,rehabEstimation,finalEstimation};
};

const computeGanttSchedule = (deal) => {
    const selIds=Object.keys(deal.selectedItems||{}).filter(id=>deal.selectedItems[id]);
    const expIds=[];
    selIds.forEach(id=>{if(id.startsWith('grouped_')){const s=(deal.selectedQualities||{})[id]||itemGroups[id]?.default;if(s)expIds.push(s);}else if(TRADE_METADATA[id]){expIds.push(id);}});
    if(expIds.length===0)return {tasks:[],totalDays:0,criticalPath:[],startDate:null,endDate:null};
    const startDate=deal.projectStartDate?new Date(deal.projectStartDate):new Date(Date.now()+14*24*60*60*1000);
    const crewSize=parseInt(deal.crewSize)||2;
    const region=deal.metroRegion||'midwest';
    const weatherBuf=deal.weatherBuffer;
    const getSeason=(d)=>{const m=d.getMonth();if(m>=11||m<=1)return 'winter';if(m>=2&&m<=4)return 'spring';if(m>=5&&m<=7)return 'summer';return 'fall';};
    const tradeAggs={};
    const ganttSqft=parseFloat(deal.sqft)||1500;const ganttPcts=deal.selectedPercentages||{};const ganttQtys=deal.selectedQuantities||{};const ganttBaths=Math.max(parseInt(deal.bathsToRemodel)||1,1);
    expIds.forEach(id=>{const meta=TRADE_METADATA[id];if(!meta)return;const tr=meta.trade;if(!tradeAggs[tr])tradeAggs[tr]={trade:tr,durationDays:0,predecessors:new Set(),items:[],fabLagDays:0,weather:false};let dur=meta.durationDays;const itemDef=rehabItemMap[id];if(itemDef){if(itemDef.areaType==='percentage'){const pct=parseFloat(ganttPcts[id])||100;dur=Math.max(dur,Math.ceil(dur*ganttSqft*pct/100/1500));}else if(itemDef.type==='item'){const qty=parseInt(ganttQtys[id])||1;dur=Math.max(dur,Math.ceil(dur*qty/4));}if(id.startsWith('b_')&&ganttBaths>1)dur=Math.ceil(dur*ganttBaths);}tradeAggs[tr].durationDays+=dur;tradeAggs[tr].fabLagDays=Math.max(tradeAggs[tr].fabLagDays,meta.fabLagDays||0);(meta.predecessors||[]).forEach(p=>{const pt=TRADE_METADATA[p]?.trade||p;if(pt!==tr)tradeAggs[tr].predecessors.add(pt);});tradeAggs[tr].items.push(id);if(meta.weather)tradeAggs[tr].weather=true;});
    const TRADE_SEQUENCE=['foundation','demo','framing','roof','windows','siding','mep_rough','insulation','drywall','exterior_paint','interior_paint','cabinets','countertops','backsplash','tile','flooring','trim','plumbing_fixtures','electrical_fixtures','hvac_final','appliances','landscaping','punch'];
    const PARALLEL_TRADES={'roof':true,'landscaping':true,'exterior_paint':true,'siding':true,'windows':true};
    Object.keys(tradeAggs).forEach(tr=>{
        const myIdx=TRADE_SEQUENCE.indexOf(tr);
        if(myIdx<=0)return;
        const existing=Object.keys(tradeAggs);
        const validPreds=Array.from(tradeAggs[tr].predecessors).filter(p=>tradeAggs[p]);
        if(validPreds.length>0||PARALLEL_TRADES[tr])return;
        for(let i=myIdx-1;i>=0;i--){
            const candidate=TRADE_SEQUENCE[i];
            if(existing.includes(candidate)){tradeAggs[tr].predecessors.add(candidate);break;}
        }
    });
    const tasks=Object.values(tradeAggs).map(t=>({trade:t.trade,baseDuration:t.durationDays,adjustedDuration:t.durationDays,predecessors:Array.from(t.predecessors).filter(p=>tradeAggs[p]),items:t.items,fabLagDays:t.fabLagDays||0,weather:t.weather,earliestStart:0,earliestFinish:0}));
    if(weatherBuf){const buf=WEATHER_BUFFERS[region]||WEATHER_BUFFERS.midwest;const season=getSeason(startDate);tasks.forEach(t=>{if(t.weather)t.adjustedDuration=Math.ceil(t.baseDuration*(1+buf[season]));});}
    const taskMap={};tasks.forEach(t=>{taskMap[t.trade]=t;});
    const visited=new Set();const sorted=[];
    const visit=(t)=>{if(visited.has(t.trade))return;visited.add(t.trade);t.predecessors.forEach(p=>taskMap[p]&&visit(taskMap[p]));sorted.push(t);};
    tasks.forEach(t=>visit(t));
    sorted.forEach(t=>{let mpf=0;t.predecessors.forEach(p=>{const pr=taskMap[p];if(pr)mpf=Math.max(mpf,pr.earliestFinish);});t.earliestStart=Math.max(mpf,t.fabLagDays||0);t.earliestFinish=t.earliestStart+t.adjustedDuration;});
    const projectDuration=Math.max(...sorted.map(t=>t.earliestFinish),0);
    const crewMult=CREW_MULTIPLIERS[crewSize]||1.0;
    const crewWorkingDays=Math.ceil(projectDuration*crewMult);
    const weekendGap=deal.weekendWork?0:Math.floor(crewWorkingDays/5)*2;
    const totalDays=crewWorkingDays+weekendGap;
    const longestFabLag=Math.max(0,...sorted.map(t=>t.fabLagDays||0));
    const cp=new Set();
    const finals=sorted.filter(t=>t.earliestFinish===projectDuration);
    finals.forEach(ft=>{const trace=(t)=>{cp.add(t.trade);t.predecessors.forEach(p=>{const pr=taskMap[p];if(pr&&pr.earliestFinish===t.earliestStart-(t.fabLagDays||0))trace(pr);});};trace(ft);});
    const endDate=new Date(startDate.getTime()+totalDays*24*60*60*1000);
    return {tasks:sorted.map(t=>({...t,startDay:Math.ceil(t.earliestStart*crewMult),endDay:Math.ceil(t.earliestFinish*crewMult),isCritical:cp.has(t.trade)})),totalDays,crewWorkingDays,weekendGap,longestFabLag,criticalPath:Array.from(cp),startDate,endDate};
};

const flipNetProfit=(arv,purchase,rehab,months,ltv,rate)=>{const closingPurchase=purchase*0.03;const loanAmt=(purchase+rehab)*ltv;const monthlyHolding=(arv*0.011)/12+250;const finCost=loanAmt*(rate/12)*months;const holdingCost=monthlyHolding*months;const baseCost=purchase+rehab+finCost+closingPurchase+holdingCost;return arv-baseCost-arv*0.075;};
const flipBaseInputs=(deal)=>{const arv=parseFloat(deal.arv)||0;const purchase=parseFloat(deal.purchasePrice)||0;const rehab=parseFloat(deal.finalEstimation)||parseFloat(deal.totalRehabCost)||computeRehabCost(deal).finalEstimation;const ltv=parseFloat(deal.ltv)/100||0.75;const rate=parseFloat(deal.interestRate)/100||0.11;const metroBM=METRO_BENCHMARKS[deal.metroDisplay]||NATIONAL_BENCHMARKS;const rehabMonths=getProjectMonths(deal).rehabMonths;const domDays=metroBM.medianDOM||55;const months=parseFloat(deal.holdMonthsOverride)>0?parseFloat(deal.holdMonthsOverride):(rehabMonths+domDays/30);return {arv,purchase,rehab,ltv,rate,months,domDays};};
const computeSensitivity=(deal)=>{const {arv,purchase,rehab,ltv,rate,months}=flipBaseInputs(deal);const arvD=[-0.10,-0.05,0,0.05,0.10];const rehabD=[-0.20,-0.10,0,0.10,0.20];const holdD=[-1,0,1,2,3];const arvRehab=arvD.map(ad=>rehabD.map(rd=>flipNetProfit(arv*(1+ad),purchase,rehab*(1+rd),months,ltv,rate)));const arvHold=arvD.map(ad=>holdD.map(hd=>flipNetProfit(arv*(1+ad),purchase,rehab,Math.max(months+hd,1),ltv,rate)));return {arvD,rehabD,holdD,arvRehab,arvHold,base:flipNetProfit(arv,purchase,rehab,months,ltv,rate)};};
const _tri=(min,mode,max)=>{if(max<=min)return min;const u=Math.random();const c=(mode-min)/(max-min);return u<c?min+Math.sqrt(u*(max-min)*(mode-min)):max-Math.sqrt((1-u)*(max-min)*(max-mode));};
const _norm=()=>{let u=0,v=0;while(!u)u=Math.random();while(!v)v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);};
const computeMonteCarlo=(deal,target)=>{const {arv,purchase,rehab,ltv,rate,months}=flipBaseInputs(deal);if(arv<=0||purchase<=0)return null;const N=8000;const arvSd=arv*0.06;const res=new Array(N);let pc=0,tc=0;for(let i=0;i<N;i++){let aArv=arv+_norm()*arvSd;if(aArv<arv*0.8)aArv=arv*0.8;const aRehab=_tri(rehab,rehab*1.05,rehab*1.30);const aMonths=_tri(months,months+0.5,months+2);const np=flipNetProfit(aArv,purchase,aRehab,aMonths,ltv,rate);res[i]=np;if(np>0)pc++;if(target>0&&np>=target)tc++;}res.sort((a,b)=>a-b);const pct=(p)=>res[Math.min(Math.floor(p*N),N-1)];const mean=res.reduce((a,b)=>a+b,0)/N;const min=res[0],max=res[N-1];const bins=24;const step=(max-min)/bins||1;const hist=new Array(bins).fill(0);res.forEach(r=>{let b=Math.floor((r-min)/step);if(b>=bins)b=bins-1;if(b<0)b=0;hist[b]++;});return {N,pProfit:pc/N,pTarget:target>0?tc/N:null,p10:pct(0.10),p50:pct(0.50),p90:pct(0.90),mean,min,max,step,hist};};

const dealEconomics=(deal)=>{const {arv,purchase,rehab,ltv,rate,months}=flipBaseInputs(deal);const closing=purchase*0.03;const loanAmt=(purchase+rehab)*ltv;const financing=loanAmt*(rate/12)*months;const monthlyHolding=(arv*0.011)/12+250;const holding=monthlyHolding*months;const selling=arv*0.075;const net=arv-purchase-rehab-financing-holding-closing-selling;const costBasis=purchase+rehab;const costBasisPct=arv>0?costBasis/arv*100:0;const grossSpreadPct=arv>0?(arv-costBasis)/arv*100:0;const marginPct=arv>0?net/arv*100:0;const cashIn=Math.max(purchase+rehab-loanAmt,0)+closing+loanAmt*0.02+holding;const roi=cashIn>0?net/cashIn*100:0;const annRoi=months>0?roi*(12/months):0;const mao70=0.70*arv-rehab;let lo=0,hi=arv||1;for(let i=0;i<44;i++){const mid=(lo+hi)/2;const n=flipNetProfit(arv,mid,rehab,months,ltv,rate);if(n>50000)lo=mid;else hi=mid;}const maoTarget=lo;return {arv,purchase,rehab,closing,financing,holding,selling,net,costBasis,costBasisPct,grossSpreadPct,marginPct,cashIn,roi,annRoi,mao70,maoTarget,months,loanAmt};};

const computeStrategyScenarios = (deal) => {
    const arv=parseFloat(deal.arv)||0;
    const purchase=parseFloat(deal.purchasePrice)||0;
    const rehab=parseFloat(deal.finalEstimation)||parseFloat(deal.totalRehabCost)||computeRehabCost(deal).finalEstimation;
    const targetAssignmentFee=parseFloat(deal.targetAssignmentFee)||15000;
    const metroBM=METRO_BENCHMARKS[deal.metroDisplay]||NATIONAL_BENCHMARKS;
    const metroDOM=metroBM.medianDOM||55;
    const metroRent=metroBM.medianRent3BR||2100;
    const months=(deal.computedDurationDays||90)/30;
    const whole_aggressive={strategy:'wholesale',subScenario:'aggressive',label:'Aggressive',assumptions:'10% of ARV, 14-day close, deep buyer required',assignmentFee:arv*0.10,cashRequired:1000,timeToClose:14,risk:4};
    const whole_market={strategy:'wholesale',subScenario:'market',label:'Market',assumptions:'5 to 7% assignment fee, 21-day close',assignmentFee:targetAssignmentFee,cashRequired:1000,timeToClose:21,risk:2};
    const whole_conservative={strategy:'wholesale',subScenario:'conservative',label:'Conservative',assumptions:'2 to 3% assignment fee, 30-day close',assignmentFee:arv*0.025,cashRequired:500,timeToClose:30,risk:1};
    const userRent=parseFloat(deal.estimatedRent)||metroRent;
    const annualRent_market=userRent*12;
    const noi_market=annualRent_market*0.95-annualRent_market*0.40;
    const totalCost=purchase+rehab+(purchase*0.03);
    const dscrLtv=FINANCING_DEFAULTS_2026.dscr.ltvCashOutRefi;
    const dscrRate=FINANCING_DEFAULTS_2026.dscr.rate;
    const refiLoanMarket=arv*dscrLtv;
    const monthlyDebtMarket=(refiLoanMarket*(dscrRate/12))/(1-Math.pow(1+dscrRate/12,-360));
    const dscr_market=noi_market/12/monthlyDebtMarket;
    const cashLeftIn_market=totalCost-refiLoanMarket;
    const cashFlow_market=noi_market-monthlyDebtMarket*12;
    const coc_market=cashLeftIn_market>0?(cashFlow_market/cashLeftIn_market)*100:0;
    const capRate_market=arv>0?(noi_market/arv)*100:0;
    const rent_aggressive={strategy:'rental',subScenario:'aggressive',label:'Aggressive',assumptions:'Premium rent (top 10%), 8% vacancy, 35% expenses',annualRent:userRent*1.10*12*0.92,cashFlow:userRent*1.10*12*0.92-userRent*1.10*12*0.35-monthlyDebtMarket*12,capRate:arv>0?((userRent*1.10*12*0.92-userRent*1.10*12*0.35)/arv)*100:0,cashLeftIn:cashLeftIn_market,coc:cashLeftIn_market>0?((userRent*1.10*12*0.92-userRent*1.10*12*0.35-monthlyDebtMarket*12)/cashLeftIn_market)*100:0,dscr:((userRent*1.10*12*0.92-userRent*1.10*12*0.35)/12)/monthlyDebtMarket,risk:4};
    const rent_market={strategy:'rental',subScenario:'market',label:'Market',assumptions:'Market rent, 5% vacancy, 40% expenses',annualRent:annualRent_market*0.95,cashFlow:cashFlow_market,capRate:capRate_market,cashLeftIn:cashLeftIn_market,coc:coc_market,dscr:dscr_market,risk:2};
    const rent_conservative={strategy:'rental',subScenario:'conservative',label:'Conservative',assumptions:'90% of market rent, fast lease-up, 3% vacancy',annualRent:userRent*0.90*12*0.97,cashFlow:userRent*0.90*12*0.97-userRent*0.90*12*0.42-monthlyDebtMarket*12,capRate:arv>0?((userRent*0.90*12*0.97-userRent*0.90*12*0.42)/arv)*100:0,cashLeftIn:cashLeftIn_market,coc:cashLeftIn_market>0?((userRent*0.90*12*0.97-userRent*0.90*12*0.42-monthlyDebtMarket*12)/cashLeftIn_market)*100:0,dscr:((userRent*0.90*12*0.97-userRent*0.90*12*0.42)/12)/monthlyDebtMarket,risk:1};
    const sellingCost=(p)=>p*0.075;
    const ltv=parseFloat(deal.ltv)/100||0.75;
    const rate=parseFloat(deal.interestRate)/100||0.11;
    const loanAmt=(purchase+rehab)*ltv;
    const closingPurchase=purchase*0.03;
    const monthlyHolding=(arv*0.011)/12+100+150;
    const rehabMonths=Math.max(months,1);
    const domMarketMonths=metroDOM/30;
    const domAggressiveMonths=(metroDOM*1.5)/30;
    const domConservativeMonths=(metroDOM*0.6)/30;
    const buildScenario=(label,subScenario,listPrice,domMonths,assumptions,risk)=>{
        const totalMonths=rehabMonths+domMonths;
        const finCost=loanAmt*(rate/12)*totalMonths;
        const holdingCost=monthlyHolding*totalMonths;
        const baseCost=purchase+rehab+finCost+closingPurchase+holdingCost;
        const netProfit=listPrice-baseCost-sellingCost(listPrice);
        const cashIn=Math.max(purchase+rehab-loanAmt,0)+closingPurchase+(loanAmt*0.02)+holdingCost;
        const roi=cashIn>0?(netProfit/cashIn)*100:0;
        const annualizedRoi=totalMonths>0?roi*(12/totalMonths):0;
        return {strategy:'flip',subScenario,label,assumptions,listPrice,netProfit,roi,annualizedRoi,months:totalMonths,risk};
    };
    const flip_aggressive=buildScenario('Aggressive','aggressive',arv*1.05,domAggressiveMonths,`List at ARV +5%, longer DOM (${Math.round(metroDOM*1.5)} days). Rehab ${rehabMonths.toFixed(1)} mo + DOM ${domAggressiveMonths.toFixed(1)} mo`,4);
    const flip_market=buildScenario('Market','market',arv,domMarketMonths,`List at ARV, standard DOM (${metroDOM} days). Rehab ${rehabMonths.toFixed(1)} mo + DOM ${domMarketMonths.toFixed(1)} mo`,2);
    const flip_conservative=buildScenario('Conservative','conservative',arv*0.96,domConservativeMonths,`List at ARV -4%, fast DOM (${Math.round(metroDOM*0.6)} days). Rehab ${rehabMonths.toFixed(1)} mo + DOM ${domConservativeMonths.toFixed(1)} mo`,1);
    return {wholesale:[whole_aggressive,whole_market,whole_conservative],rental:[rent_aggressive,rent_market,rent_conservative],flip:[flip_aggressive,flip_market,flip_conservative]};
};

const computeFinancingScenarios = (deal,strategy) => {
    const arv=parseFloat(deal.arv)||0;
    const purchase=parseFloat(deal.purchasePrice)||0;
    const rehab=parseFloat(deal.finalEstimation)||parseFloat(deal.totalRehabCost)||computeRehabCost(deal).finalEstimation;
    const months=getProjectMonths(deal).totalProjectMonths;
    const totalCost=purchase+rehab;
    const closingPurchase=purchase*FINANCING_DEFAULTS_2026.closingCosts.purchasePct;
    const closingSale=arv*FINANCING_DEFAULTS_2026.closingCosts.saleAllInPct;
    const monthlyTax=(arv*FINANCING_DEFAULTS_2026.holdingCosts.propertyTaxAnnualPct)/12;
    const monthlyIns=FINANCING_DEFAULTS_2026.holdingCosts.insuranceMonthlyVacant;
    const monthlyUtil=FINANCING_DEFAULTS_2026.holdingCosts.utilitiesMonthlyRehab;
    const monthlyHolding=monthlyTax+monthlyIns+monthlyUtil;
    const totalHoldingCash=monthlyHolding*months;
    const sellerBalance=parseFloat(deal.sellerMortgageBalance)||0;
    const sellerRate=parseFloat(deal.sellerMortgageRate)/100||0;
    const tier=deal.creditTier||'1-3deals';
    const tierMap={'firstTimer':'firstTimer','1-3deals':'moderate','3+deals':'moderate','10+deals':'experienced'};
    const hmTier=FINANCING_DEFAULTS_2026.hardMoney.tiers[tierMap[tier]||'moderate'];
    const subjectToAvail=sellerBalance>0&&sellerRate>0;

    if(strategy==='flip'){
        const sellingCost=closingSale;
        const allCash=(()=>{const co=totalCost+closingPurchase+totalHoldingCash;const pc=totalCost+closingPurchase+totalHoldingCash+sellingCost;const np=arv-pc;const coc=co>0?(np/co)*100:0;const ar=months>0?coc*(12/months):0;const risk=Math.min(5,1.0+Math.max(0,(months-6)*0.15));return {id:'allCash',name:'All Cash',cashRequired:co,loanAmount:0,monthlyCarry:0,totalFinancingCost:0,acquisitionCost:purchase+closingPurchase,totalProjectCost:pc,netProfit:np,coc,annualizedROI:ar,timeToFirstDollar:months,risk:Math.round(risk*10)/10,available:true};})();
        const hmStandard=(()=>{const llp=purchase*hmTier.ltvPurchase;const lla=arv*hmTier.arv;const la=Math.min(llp+rehab,lla);const pts=la*hmTier.points;const mi=la*(hmTier.rate/12);const fc=mi*months+pts;const dp=totalCost-la;const co=Math.max(dp,0)+closingPurchase+pts+totalHoldingCash;const pc=totalCost+closingPurchase+totalHoldingCash+sellingCost+fc;const np=arv-pc;const coc=co>0?(np/co)*100:0;const ar=months>0?coc*(12/months):0;const mc=mi+monthlyHolding;const leverageRatio=co>0?la/co:1;const risk=Math.min(5,2.0+leverageRatio*0.8+Math.max(0,(months-6)*0.15));return {id:'hardMoneyStandard',name:'Hard Money Standard',cashRequired:co,loanAmount:la,monthlyCarry:mc,totalFinancingCost:fc,acquisitionCost:purchase+closingPurchase,totalProjectCost:pc,netProfit:np,coc,annualizedROI:ar,timeToFirstDollar:months,risk:Math.round(Math.min(risk,5)*10)/10,available:true};})();
        const hmLayered=(()=>{const lla=arv*hmTier.arv;const hml=Math.min(purchase*hmTier.ltvPurchase+rehab,lla);const gap=Math.max(totalCost-hml,0);const pl=gap;const hp=hml*hmTier.points;const pr=0.08;const mi=hml*(hmTier.rate/12)+pl*(pr/12);const fc=mi*months+hp;const co=closingPurchase+hp+totalHoldingCash;const pc=totalCost+closingPurchase+totalHoldingCash+sellingCost+fc;const np=arv-pc;const coc=co>0?(np/co)*100:0;const ar=months>0?coc*(12/months):0;const td=hml+pl;const leverageRatio=co>0?td/co:1;const risk=Math.min(5,3.0+leverageRatio*0.5+Math.max(0,(months-6)*0.15));return {id:'hardMoneyLayered',name:'HM + Private Money',cashRequired:co,loanAmount:td,monthlyCarry:mi+monthlyHolding,totalFinancingCost:fc,acquisitionCost:purchase+closingPurchase,totalProjectCost:pc,netProfit:np,coc,annualizedROI:ar,timeToFirstDollar:months,risk:Math.round(Math.min(risk,5)*10)/10,available:true,secondaryLoan:pl};})();
        const dscrPivot={id:'dscrPivot',name:'DSCR Pivot to BRRRR',cashRequired:0,loanAmount:0,monthlyCarry:0,totalFinancingCost:0,acquisitionCost:0,totalProjectCost:0,netProfit:0,coc:0,annualizedROI:0,timeToFirstDollar:0,risk:0,available:false,unavailableReason:'Switch to BRRRR strategy for DSCR math.'};
        const subjectTo=(()=>{if(!subjectToAvail)return {id:'subjectTo',name:'Subject-To',cashRequired:0,loanAmount:0,monthlyCarry:0,totalFinancingCost:0,acquisitionCost:0,totalProjectCost:0,netProfit:0,coc:0,annualizedROI:0,timeToFirstDollar:0,risk:0,available:false,unavailableReason:'Enter seller mortgage balance and rate.'};const eq=Math.max(purchase-sellerBalance,0);const mi=sellerBalance*(sellerRate/12);const fc=mi*months+FINANCING_DEFAULTS_2026.subjectTo.legalSetupCost;const co=eq+closingPurchase+rehab+totalHoldingCash+FINANCING_DEFAULTS_2026.subjectTo.legalSetupCost;const pc=totalCost+closingPurchase+totalHoldingCash+sellingCost+fc;const np=arv-pc;const coc=co>0?(np/co)*100:0;const ar=months>0?coc*(12/months):0;const risk=Math.min(5,3.5+Math.max(0,(months-6)*0.2));return {id:'subjectTo',name:'Subject-To',cashRequired:co,loanAmount:sellerBalance,monthlyCarry:mi+monthlyHolding,totalFinancingCost:fc,acquisitionCost:eq+closingPurchase,totalProjectCost:pc,netProfit:np,coc,annualizedROI:ar,timeToFirstDollar:months,risk:Math.round(Math.min(risk,5)*10)/10,available:true};})();
        return [allCash,hmStandard,hmLayered,dscrPivot,subjectTo];
    }
    if(strategy==='rental'){
        const userRent=parseFloat(deal.estimatedRent)||(METRO_BENCHMARKS[deal.metroDisplay]?.medianRent3BR||2100);
        const noi=userRent*12*0.60;
        const dscrRate=FINANCING_DEFAULTS_2026.dscr.rate;
        const refiLoan=arv*FINANCING_DEFAULTS_2026.dscr.ltvCashOutRefi;
        const refiPI=(refiLoan*(dscrRate/12))/(1-Math.pow(1+dscrRate/12,-360));
        const refiClosing=refiLoan*FINANCING_DEFAULTS_2026.conventionalCashOutRefi.closingCostPct;
        const dscrPoints=refiLoan*FINANCING_DEFAULTS_2026.dscr.points;
        const sm=FINANCING_DEFAULTS_2026.dscr.seasoningMonthsCashOut;
        const allCashRefi=(()=>{const ci=totalCost+closingPurchase+totalHoldingCash;const co=refiLoan-dscrPoints-refiClosing;const ncli=ci-co;const acf=noi-refiPI*12;const coc=ncli>0?(acf/ncli)*100:0;const rp=ci>0?(co/ci)*100:0;const tf=dscrPoints+refiClosing;return {id:'allCashDscr',name:'Cash + DSCR Refi',cashRequired:ci,loanAmount:refiLoan,monthlyCarry:refiPI,totalFinancingCost:tf,acquisitionCost:purchase+closingPurchase,totalProjectCost:ci,netProfit:acf,coc,annualizedROI:coc,timeToFirstDollar:months+sm,risk:1.5,available:true,recyclePct:rp};})();
        const hmDscr=(()=>{const hml=Math.min(purchase*hmTier.ltvPurchase+rehab,arv*hmTier.arv);const pts=hml*hmTier.points;const dp=totalCost-hml;const mi=hml*(hmTier.rate/12);const hc=mi*months+pts;const ci=Math.max(dp,0)+closingPurchase+pts+totalHoldingCash;const co=refiLoan-hml-dscrPoints-refiClosing;const ncli=Math.max(ci-co,0);const acf=noi-refiPI*12;const coc=ncli>0?(acf/ncli)*100:(acf>0?999:0);const rp=ci>0?(co/ci)*100:0;const tf=hc+dscrPoints+refiClosing;return {id:'hmDscr',name:'HM + DSCR Refi',cashRequired:ci,loanAmount:refiLoan,monthlyCarry:refiPI,totalFinancingCost:tf,acquisitionCost:purchase+closingPurchase,totalProjectCost:ci,netProfit:acf,coc,annualizedROI:coc,timeToFirstDollar:months+sm,risk:2.5,available:true,secondaryLoan:hml,recyclePct:rp};})();
        const convConv=(()=>{const pl=purchase*0.75;const dp=purchase-pl;const pr=FINANCING_DEFAULTS_2026.conventionalCashOutRefi.rate;const ppi=(pl*(pr/12))/(1-Math.pow(1+pr/12,-360));const ci=dp+closingPurchase+rehab+totalHoldingCash;const rlc=arv*FINANCING_DEFAULTS_2026.conventionalCashOutRefi.ltvCap;const co=rlc-pl-refiClosing;const ncli=Math.max(ci-co,0);const npi=(rlc*(pr/12))/(1-Math.pow(1+pr/12,-360));const acf=noi-npi*12;const coc=ncli>0?(acf/ncli)*100:0;const rp=ci>0?(co/ci)*100:0;const tf=(ppi*months)+refiClosing;return {id:'convConv',name:'Conv + Conv Refi',cashRequired:ci,loanAmount:rlc,monthlyCarry:npi,totalFinancingCost:tf,acquisitionCost:purchase+closingPurchase,totalProjectCost:ci,netProfit:acf,coc,annualizedROI:coc,timeToFirstDollar:13,risk:1.5,available:rehab<20000,unavailableReason:rehab>=20000?'Conventional requires habitable property.':null,recyclePct:rp};})();
        const subToDscr=(()=>{if(!subjectToAvail)return {id:'subToDscr',name:'Subject-To + DSCR',available:false,unavailableReason:'Enter seller mortgage details.',cashRequired:0,loanAmount:0,monthlyCarry:0,totalFinancingCost:0,acquisitionCost:0,totalProjectCost:0,netProfit:0,coc:0,annualizedROI:0,timeToFirstDollar:0,risk:0};const eq=Math.max(purchase-sellerBalance,0);const mi=sellerBalance*(sellerRate/12);const ci=eq+closingPurchase+rehab+totalHoldingCash+FINANCING_DEFAULTS_2026.subjectTo.legalSetupCost;const co=refiLoan-sellerBalance-dscrPoints-refiClosing;const ncli=Math.max(ci-co,0);const acf=noi-refiPI*12;const coc=ncli>0?(acf/ncli)*100:0;const rp=ci>0?(co/ci)*100:0;const tf=mi*months+dscrPoints+refiClosing+FINANCING_DEFAULTS_2026.subjectTo.legalSetupCost;return {id:'subToDscr',name:'Sub-To + DSCR Refi',cashRequired:ci,loanAmount:refiLoan,monthlyCarry:refiPI,totalFinancingCost:tf,acquisitionCost:eq+closingPurchase,totalProjectCost:ci,netProfit:acf,coc,annualizedROI:coc,timeToFirstDollar:months+sm,risk:3.0,available:true,secondaryLoan:sellerBalance,recyclePct:rp};})();
        const sellerFin=(()=>{if(!deal.sellerFreeAndClear)return {id:'sellerFin',name:'Seller Fin + DSCR',available:false,unavailableReason:'Toggle Seller Free-and-Clear.',cashRequired:0,loanAmount:0,monthlyCarry:0,totalFinancingCost:0,acquisitionCost:0,totalProjectCost:0,netProfit:0,coc:0,annualizedROI:0,timeToFirstDollar:0,risk:0};const dp=purchase*0.10;const sl=purchase-dp;const sra=0.06;const mi=sl*(sra/12);const ci=dp+closingPurchase+rehab+totalHoldingCash;const co=refiLoan-sl-dscrPoints-refiClosing;const ncli=Math.max(ci-co,0);const acf=noi-refiPI*12;const coc=ncli>0?(acf/ncli)*100:0;const rp=ci>0?(co/ci)*100:0;const tf=mi*months+dscrPoints+refiClosing;return {id:'sellerFin',name:'Seller Fin + DSCR',cashRequired:ci,loanAmount:refiLoan,monthlyCarry:refiPI,totalFinancingCost:tf,acquisitionCost:dp+closingPurchase,totalProjectCost:ci,netProfit:acf,coc,annualizedROI:coc,timeToFirstDollar:months+sm,risk:2.0,available:true,secondaryLoan:sl,recyclePct:rp};})();
        return [allCashRefi,hmDscr,convConv,subToDscr,sellerFin];
    }
    if(strategy==='wholesale'){
        const targetFee=parseFloat(deal.targetAssignmentFee)||15000;
        const emdOnly=(()=>{const emd=1000;return {id:'emdOnly',name:'EMD Only Assignment',cashRequired:emd,loanAmount:0,monthlyCarry:0,totalFinancingCost:0,acquisitionCost:emd,totalProjectCost:emd,netProfit:targetFee,coc:emd>0?(targetFee/emd)*100:0,annualizedROI:emd>0?(targetFee/emd)*100*(12/0.7):0,timeToFirstDollar:0.7,risk:1.5,available:true};})();
        const trans=(()=>{const fee=Math.max(purchase*FINANCING_DEFAULTS_2026.transactionalFunding.feePct+FINANCING_DEFAULTS_2026.transactionalFunding.processingFee,FINANCING_DEFAULTS_2026.transactionalFunding.minFee);const co=fee+1000;const pf=targetFee-fee;return {id:'transactional',name:'Transactional Funding',cashRequired:co,loanAmount:purchase,monthlyCarry:0,totalFinancingCost:fee,acquisitionCost:co,totalProjectCost:co,netProfit:pf,coc:co>0?(pf/co)*100:0,annualizedROI:co>0?(pf/co)*100*(12/0.7):0,timeToFirstDollar:0.7,risk:2.0,available:true};})();
        const emdLoan=(()=>{const emd=1000;const lf=emd*0.02+500;return {id:'emdLoan',name:'EMD-Only Loan',cashRequired:500,loanAmount:emd,monthlyCarry:0,totalFinancingCost:lf,acquisitionCost:500+emd,totalProjectCost:500+lf,netProfit:targetFee-lf,coc:((targetFee-lf)/500)*100,annualizedROI:((targetFee-lf)/500)*100*(12/0.7),timeToFirstDollar:0.7,risk:2.0,available:true};})();
        const jv=(()=>{const jvf=targetFee/2;return {id:'jvBuyer',name:'JV with Cash Buyer',cashRequired:500,loanAmount:0,monthlyCarry:0,totalFinancingCost:0,acquisitionCost:500,totalProjectCost:500,netProfit:jvf,coc:(jvf/500)*100,annualizedROI:(jvf/500)*100*(12/0.7),timeToFirstDollar:0.7,risk:1.0,available:true};})();
        const wholeHml=(()=>{const hml=purchase*hmTier.ltvPurchase;const pts=hml*hmTier.points;const dp=purchase-hml;const mi=hml*(hmTier.rate/12);const fc=mi*1+pts;const co=dp+closingPurchase+pts;const rn=arv*0.95-hml-fc;return {id:'wholeHml',name:'Double-Close + HML',cashRequired:co,loanAmount:hml,monthlyCarry:mi,totalFinancingCost:fc,acquisitionCost:co,totalProjectCost:co+fc,netProfit:rn-co,coc:co>0?((rn-co)/co)*100:0,annualizedROI:co>0?((rn-co)/co)*100*12:0,timeToFirstDollar:1,risk:3.5,available:true};})();
        return [emdOnly,trans,emdLoan,jv,wholeHml];
    }
    return [];
};

const computeDealScore = (deal) => {
    const sqft=parseFloat(deal.sqft)||0;
    const arv=parseFloat(deal.arv)||0;
    const purchase=parseFloat(deal.purchasePrice)||0;
    const rehab=parseFloat(deal.finalEstimation)||parseFloat(deal.totalRehabCost)||computeRehabCost(deal).finalEstimation;
    const userCash=parseFloat(deal.userCashAvailable)||0;
    const projectTime=getProjectMonths(deal);
    const months=projectTime.totalProjectMonths;
    const metroBM=METRO_BENCHMARKS[deal.metroDisplay]||NATIONAL_BENCHMARKS;
    const ltv=parseFloat(deal.ltv)/100||0.75;
    const totalCost=purchase+rehab;
    const loanAmount=totalCost*ltv;
    const equity=Math.max(totalCost-loanAmount,1);
    const loanPoints=loanAmount*0.02;
    const finCosts=loanAmount*(parseFloat(deal.interestRate)/100/12)*months+loanPoints;
    const closingPurch=purchase*0.03;
    const sellingCost=arv*0.075;
    const totalProjectCost=totalCost+closingPurch+sellingCost+finCosts;
    const netProfit=arv-totalProjectCost;
    const cashRequired=equity+closingPurch+finCosts;
    const rawGrossProfit=arv-totalCost;
    const grossProfit=Math.max(rawGrossProfit,1);
    const slide=(v,hi,lo,mx)=>{if(v>=hi)return mx;if(v<=lo)return 0;return Math.round(((v-lo)/(hi-lo))*mx*10)/10;};
    const slideRev=(v,lo,hi,mx)=>{if(v<=lo)return mx;if(v>=hi)return 0;return Math.round(((hi-v)/(hi-lo))*mx*10)/10;};
    const profitMargin=arv>0?(netProfit/arv)*100:0;
    const m1=slide(profitMargin,20,5,8);
    const roiCash=cashRequired>0?(netProfit/cashRequired)*100:0;
    const m2=slide(roiCash,40,10,7);
    const annROI=months>0?roiCash*(12/months):0;
    const m3=slide(annROI,80,20,7);
    const costBasisPct=arv>0?(totalCost/arv)*100:100;
    const m4=slideRev(costBasisPct,70,90,8);
    const m5=slide(netProfit,50000,10000,5);
    const purchPerSqft=sqft>0?purchase/sqft:0;
    const purchVsMetro=metroBM.medianPricePerSqft>0?(purchPerSqft/metroBM.medianPricePerSqft)*100:100;
    const m6=slideRev(purchVsMetro,80,110,5);
    const arvPerSqft=sqft>0?arv/sqft:0;
    const arvVsMetro=metroBM.medianPricePerSqft>0?Math.abs((arvPerSqft/metroBM.medianPricePerSqft-1)*100):0;
    const m7=slideRev(arvVsMetro,10,30,5);
    const holdDays=months*30;
    const domRatio=metroBM.medianDOM>0?holdDays/metroBM.medianDOM:1;
    const m8=domRatio<=1.2?5:(domRatio>=2?0:Math.round((1-(domRatio-1.2)/0.8)*5*10)/10);
    const cashRatio=userCash>0?(cashRequired/userCash)*100:200;
    const m9=slideRev(cashRatio,60,110,5);
    const leverage=equity>0?loanAmount/equity:99;
    const m10=slideRev(leverage,2,5,5);
    const finCostPct=grossProfit>0?(finCosts/grossProfit)*100:100;
    const m11=slideRev(finCostPct,15,40,5);
    const structuralItems=['k_framing','k_mep_overhaul','b_framing','b_mep_overhaul','foundation_repair','elec_panel'];
    const structuralCount=structuralItems.filter(id=>(deal.selectedItems||{})[id]).length;
    const m12=structuralCount===0?5:Math.max(0,5-structuralCount*1.7);
    const expectedDays=Math.max(structuralCount*30+45,30);
    const ganttDays=projectTime.ganttDays;
    const timelineDelta=expectedDays>0?Math.abs(ganttDays-expectedDays)/expectedDays*100:0;
    const m13=slideRev(timelineDelta,10,40,5);
    const majorSys=['foundation_repair','roof','k_mep_overhaul','b_mep_overhaul','elec_panel','hvac'];
    const majorCount=majorSys.filter(id=>(deal.selectedItems||{})[id]).length;
    const m14=majorCount===0?5:Math.max(0,5-majorCount*1.7);
    const cashLow=userCash>0&&userCash<50000;
    const cashHigh=userCash>=200000;
    const strategy=deal.selectedStrategy;
    let recStrategy='flip';
    if(cashLow)recStrategy='wholesale';
    else if(cashHigh&&(metroBM.flipROI||25.5)<15)recStrategy='rental';
    const profitPositive=netProfit>0;
    const m15=profitPositive?(strategy===recStrategy?5:(strategy?3:1)):0;
    const fin=deal.selectedFinancingScenario;
    let recFin='hardMoneyStandard';
    if(cashHigh&&strategy==='flip')recFin='allCash';
    if(strategy==='rental')recFin='hmDscr';
    if(strategy==='wholesale')recFin='emdOnly';
    const m16=profitPositive?(fin===recFin?5:(fin?3:1)):0;
    const tfd=strategy==='wholesale'?1:(strategy==='rental'?months+6:months);
    const m17=slideRev(tfd,6,18,5);
    const stressArv=arv*0.90;
    const stressRehabCost=rehab*1.20;
    const stressMonths=months+2;
    const passProfit=netProfit>0;
    const passArvDrop=(stressArv-totalProjectCost+(arv-stressArv)*0.075)>0;
    const passRehabOver=(arv-(purchase+stressRehabCost+closingPurch+sellingCost+finCosts))>0;
    const passTimeSlip=(arv-(totalCost+closingPurch+sellingCost+(loanAmount*(parseFloat(deal.interestRate)/100/12)*stressMonths+loanAmount*0.02)))>0;
    const passes=(passProfit?1:0)+(passArvDrop?1:0)+(passRehabOver?1:0)+(passTimeSlip?1:0);
    const m18=passes>=4?3:(passes===3?2.5:(passes===2?1.5:(passes===1?0.5:0)));
    const contingency=rehab*0.10;
    const reserveRatio=totalProjectCost>0?(contingency/totalProjectCost)*100:0;
    const m19=reserveRatio>=15?1:(reserveRatio<5?0:0.5);
    let m20=1;
    if(strategy==='rental'){const refiLoan=arv*0.75;const recyclePct=cashRequired>0?(refiLoan/cashRequired)*100:0;m20=recyclePct>=85?1:(recyclePct<=50?0:0.5);}
    const metrics=[
        {id:1,name:'Profit Margin',score:m1,max:8,value:`${profitMargin.toFixed(1)}%`,why:`Net ${formatCurrencySimple(netProfit)} / ARV. Target 20%+.`,category:'Financial'},
        {id:2,name:'ROI on Cash',score:m2,max:7,value:`${roiCash.toFixed(1)}%`,why:`Net / cash invested ${formatCurrencySimple(cashRequired)}. Target 40%+.`,category:'Financial'},
        {id:3,name:'Annualized ROI',score:m3,max:7,value:`${annROI.toFixed(1)}%`,why:`ROI x (12 / ${months.toFixed(1)} months).`,category:'Financial'},
        {id:4,name:'Cost Basis vs ARV',score:m4,max:8,value:`${costBasisPct.toFixed(1)}%`,why:`70% rule says stay under 70%.`,category:'Financial'},
        {id:5,name:'Absolute Net Profit',score:m5,max:5,value:formatCurrencySimple(netProfit),why:`Target $50K minimum.`,category:'Financial'},
        {id:6,name:'Purchase $/sqft vs Metro',score:m6,max:5,value:`${purchVsMetro.toFixed(0)}%`,why:`$${purchPerSqft.toFixed(0)}/sqft vs metro $${metroBM.medianPricePerSqft}/sqft.`,category:'Market'},
        {id:7,name:'ARV $/sqft Sanity',score:m7,max:5,value:`${arvVsMetro.toFixed(0)}% off`,why:`ARV $${arvPerSqft.toFixed(0)}/sqft vs metro $${metroBM.medianPricePerSqft}.`,category:'Market'},
        {id:8,name:'DOM Realism',score:m8,max:5,value:`${holdDays.toFixed(0)} days`,why:`Holding vs metro DOM ${metroBM.medianDOM} days.`,category:'Market'},
        {id:9,name:'Cash Required vs Available',score:m9,max:5,value:`${cashRatio.toFixed(0)}%`,why:`Need ${formatCurrencySimple(cashRequired)} / have ${formatCurrencySimple(userCash)}.`,category:'Capital'},
        {id:10,name:'Leverage Risk',score:m10,max:5,value:`${leverage.toFixed(1)}:1`,why:`Debt / equity. Under 2:1 is conservative.`,category:'Capital'},
        {id:11,name:'Financing Cost % of Profit',score:m11,max:5,value:rawGrossProfit>0?`${finCostPct.toFixed(1)}%`:'N/A (no gross profit)',why:`Financing / gross profit.`,category:'Capital'},
        {id:12,name:'Rehab Complexity',score:m12,max:5,value:`${structuralCount} structural`,why:`Each structural item adds 30%+ timeline risk.`,category:'Execution'},
        {id:13,name:'Timeline Realism',score:m13,max:5,value:`${ganttDays} days`,why:`Gantt ${ganttDays} vs expected ${expectedDays}.`,category:'Execution'},
        {id:14,name:'Major Systems Risk',score:m14,max:5,value:`${majorCount} flagged`,why:`${majorCount} of foundation/roof/HVAC/MEP. Get bids.`,category:'Execution'},
        {id:15,name:'Strategy Fit',score:m15,max:5,value:strategy||'none',why:`Recommended ${recStrategy}.`,category:'Strategy'},
        {id:16,name:'Financing Fit',score:m16,max:5,value:fin||'none',why:`Recommended ${recFin}.`,category:'Strategy'},
        {id:17,name:'Time to First Dollar',score:m17,max:5,value:`${tfd.toFixed(1)} mo`,why:`Under 6 months is high velocity.`,category:'Strategy'},
        {id:18,name:'Stress Test Survival',score:m18,max:3,value:`${passes}/4 pass`,why:`ARV -10%, rehab +20%, 60-day slip tests.`,category:'Safety'},
        {id:19,name:'Reserve Adequacy',score:m19,max:1,value:`${reserveRatio.toFixed(1)}%`,why:`Contingency / project cost. Target 15%+.`,category:'Safety'},
        {id:20,name:'Capital Recycle',score:m20,max:1,value:strategy==='rental'?`${(arv*0.75/Math.max(cashRequired,1)*100).toFixed(0)}%`:'Full exit',why:strategy==='rental'?`BRRRR refi vs cash in.`:'Capital recovered at sale.',category:'Safety'}
    ];
    const total=metrics.reduce((s,m)=>s+m.score,0);
    const verdict=total>=80?'BUY':(total>=60?'WAIT':'KILL');
    const grade=total>=90?'A':(total>=80?'B':(total>=70?'C':(total>=60?'D':'F')));
    const categoryTotals={Financial:metrics.filter(m=>m.category==='Financial').reduce((s,m)=>s+m.score,0),Market:metrics.filter(m=>m.category==='Market').reduce((s,m)=>s+m.score,0),Capital:metrics.filter(m=>m.category==='Capital').reduce((s,m)=>s+m.score,0),Execution:metrics.filter(m=>m.category==='Execution').reduce((s,m)=>s+m.score,0),Strategy:metrics.filter(m=>m.category==='Strategy').reduce((s,m)=>s+m.score,0),Safety:metrics.filter(m=>m.category==='Safety').reduce((s,m)=>s+m.score,0)};
    return {metrics,total,verdict,grade,categoryTotals,passes};
};

const useCountUp = (target,duration=600) => {
    const [v,setV]=useState(target);
    const ref=useRef({start:target,startTime:0,raf:null});
    useEffect(()=>{const r=ref.current;cancelAnimationFrame(r.raf);r.start=v;r.startTime=performance.now();const tick=(t)=>{const p=Math.min((t-r.startTime)/duration,1);const eased=1-Math.pow(1-p,3);setV(r.start+(target-r.start)*eased);if(p<1)r.raf=requestAnimationFrame(tick);};r.raf=requestAnimationFrame(tick);return ()=>cancelAnimationFrame(r.raf);},[target,duration]);
    return v;
};

const usePreferences = () => {
    const [prefs,setPrefs]=useState(()=>safeGet(STORAGE_KEYS.preferences,{ltv:'75',interestRate:'11',holdingPeriod:'6'}));
    const update=useCallback((p)=>setPrefs(prev=>{const n={...prev,...p};safeSet(STORAGE_KEYS.preferences,n);return n;}),[]);
    return {prefs,updatePreferences:update};
};

const lookupMetroByZip = async (zip) => {
    try{const r=await fetch(`https://api.zippopotam.us/us/${zip}`);if(!r.ok)return null;const d=await r.json();const p=d.places[0];const lat=parseFloat(p.latitude);const lon=parseFloat(p.longitude);const state=p['state abbreviation'];let nearest=null;let minD=Infinity;METRO_DATA.forEach(m=>{const dist=getDistance(lat,lon,m.lat,m.lon);if(dist<minD){minD=dist;nearest=m;}});return nearest?{metro:nearest.metro,multiplier:nearest.multiplier,region:nearest.region||'midwest',state}:null;}catch(e){return null;}
};

const SavedDealsContext = createContext(null);
const SavedDealsProvider = ({children}) => {
    const sd=useSavedDeals();
    return <SavedDealsContext.Provider value={sd}>{children}</SavedDealsContext.Provider>;
};
const useSavedDealsContext = () => useContext(SavedDealsContext);

const SettingsContext = createContext(null);
const SettingsProvider = ({children}) => {
    const [settings,setSettings]=useState(null);
    useEffect(()=>{let active=true;(async()=>{const {data:{user}}=await supabase.auth.getUser();if(!user)return;let {data}=await supabase.from('user_settings').select('*').eq('user_id',user.id).maybeSingle();if(!data){const def={user_id:user.id,cash_available:100000,credit_tier:'1-3deals',target_assignment_fee:15000};const ins=await supabase.from('user_settings').insert(def).select().single();data=ins.data||def;}if(active)setSettings(data);})();return ()=>{active=false;};},[]);
    const updateSettings=useCallback((patch)=>{setSettings(p=>({...(p||{}),...patch}));(async()=>{const {data:{user}}=await supabase.auth.getUser();if(!user)return;await supabase.from('user_settings').update({...patch,updated_at:new Date().toISOString()}).eq('user_id',user.id);})();},[]);
    return <SettingsContext.Provider value={{settings,updateSettings}}>{children}</SettingsContext.Provider>;
};
const useSettings = () => useContext(SettingsContext)||{settings:null,updateSettings:()=>{}};

const useZipMarket = (zip) => {
    const [row,setRow]=useState(null);
    const [loading,setLoading]=useState(false);
    useEffect(()=>{
        const z=(zip||'').trim();
        if(!/^\d{5}$/.test(z)){setRow(null);return;}
        let active=true;setLoading(true);
        supabase.from('zip_market_data').select('*').eq('zipcode',z).maybeSingle().then(({data})=>{if(active){setRow(data||null);setLoading(false);}});
        return ()=>{active=false;};
    },[zip]);
    return {row,loading};
};

const MarketSnapshot = () => {
    const {deal,updateDeal}=useDeal();
    const toast=useToast();
    const {row:market,loading}=useZipMarket(deal.zip);
    const zipValid=/^\d{5}$/.test((deal.zip||'').trim());
    const beds=parseInt(deal.beds)||0;
    if(!zipValid||!beds) return null;
    if(loading) return (<aside className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-4 mt-4 no-print"><div className="flex items-center gap-2 text-xs text-slate-500"><div className="w-3.5 h-3.5 rounded-full border-2 border-[#2A2A2A] border-t-amber-400" style={{animation:'eo_spin .7s linear infinite'}}></div>Loading market data…</div></aside>);
    if(!market) return (<aside className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-4 mt-4 no-print"><p className="text-xs text-slate-500">No Zillow/Redfin data on file for ZIP {deal.zip}.</p></aside>);
    const bedKey={1:'avg_1bed',2:'avg_2bed',3:'avg_3bed',4:'avg_4bed',5:'avg_5bed'}[Math.min(Math.max(beds,1),5)];
    const bedVal=market[bedKey];
    const arv=parseFloat(deal.arv)||0;
    const sqft=parseFloat(deal.sqft)||0;
    const zipPpsf=market.median_sale_price_per_sqft;
    const userPpsf=(sqft>0&&arv>0)?arv/sqft:0;
    const ppsfDelta=(zipPpsf&&userPpsf)?((userPpsf-zipPpsf)/zipPpsf)*100:null;
    const mos=market.months_of_supply;
    const heat=mos==null?null:(mos<3?{t:'Fast-moving market',c:'text-emerald-300',b:'bg-emerald-500/10 border-emerald-500/30'}:mos<=6?{t:'Balanced market',c:'text-amber-300',b:'bg-amber-500/10 border-amber-500/30'}:{t:'Slow market',c:'text-red-300',b:'bg-red-500/10 border-red-500/30'});
    const applyArv=(v)=>{updateDeal({arv:String(Math.round(v))});toast?.show('ARV set from ZIP data');};
    const Stat=({label,value})=>(<div className="bg-[#0F0F0F] rounded p-2"><p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p><p className="text-sm text-white accent-num mt-0.5">{value}</p></div>);
    return (
        <aside className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-5 mt-4 no-print eo-stagger">
            <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-wider text-slate-400 headline flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-amber-400" /> Market Snapshot</h3>
                <span className="text-[10px] text-slate-600">ZIP {market.zipcode}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 truncate">{[market.city,market.state].filter(Boolean).join(', ')}{market.metro?` · ${market.metro.split(',')[0]}`:''}</p>
            {heat&&<div className={`mt-3 text-xs px-2.5 py-1.5 rounded border inline-flex items-center gap-1.5 ${heat.b} ${heat.c}`}><Activity className="w-3 h-3" />{heat.t}{mos!=null?` · ${mos} mo supply`:''}</div>}
            <div className="mt-3 bg-[#0F0F0F] rounded-lg p-3">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">Typical {beds}-bed value (ZIP)</p>
                <div className="flex items-center justify-between gap-2 mt-1">
                    <p className="text-xl font-bold gradient-text accent-num">{bedVal?formatCurrencySimple(bedVal):'—'}</p>
                    {bedVal>0&&<button onClick={()=>applyArv(bedVal)} className="text-[11px] fire-bg text-black font-bold px-2.5 py-1 rounded flex items-center gap-1 hover:opacity-90"><Check className="w-3 h-3" /> Use as ARV</button>}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
                <Stat label="Median sale" value={market.median_sale_price_nsa?formatCurrencySimple(market.median_sale_price_nsa):'—'} />
                <Stat label="Median $/sqft" value={zipPpsf?`$${Math.round(zipPpsf)}`:'—'} />
                <Stat label="Days on market" value={market.median_days_on_market!=null?`${Math.round(market.median_days_on_market)} days`:'—'} />
                <Stat label="Sale-to-list" value={market.avg_sale_to_list_ratio_pct!=null?`${market.avg_sale_to_list_ratio_pct}%`:'—'} />
            </div>
            {ppsfDelta!=null&&<div className="mt-3 text-xs flex items-start gap-1.5">{Math.abs(ppsfDelta)<=10?<CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />:<AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />}<span className="text-slate-400">Your ARV is <span className={ppsfDelta>0?'text-amber-300':'text-emerald-300'}>{Math.abs(ppsfDelta).toFixed(0)}% {ppsfDelta>0?'above':'below'}</span> the ZIP median $/sqft</span></div>}
            <p className="text-[10px] text-slate-600 mt-3">Zillow + Redfin{market.date_updated?` · as of ${market.date_updated}`:''}</p>
        </aside>
    );
};

const DealSnapshotRail = () => {
    const {deal,updateDeal}=useDeal();
    const {saveDeal}=useSavedDealsContext();
    const toast=useToast();
    const arv=parseFloat(deal.arv)||0;
    const purchase=parseFloat(deal.purchasePrice)||0;
    const rehab=parseFloat(deal.finalEstimation)||parseFloat(deal.totalRehabCost)||0;
    const target=parseFloat(deal.targetProfit)||0;
    const sqft=parseFloat(deal.sqft)||0;
    const score=useMemo(()=>computeDealScore(deal),[deal]);
    const m=useMemo(()=>getDealMetrics(arv,purchase,rehab,{ltv:parseFloat(deal.ltv)||0,interestRate:parseFloat(deal.interestRate)||0,holdingPeriod:parseFloat(deal.holdingPeriod)||0},sqft,deal.extraCosts||[],deal),[arv,purchase,rehab,deal.ltv,deal.interestRate,deal.holdingPeriod,sqft,deal.extraCosts,deal.computedDurationDays]);
    const hasInputs=arv>0&&purchase>0;
    let npc='kpi-bad';
    if(target>0){if(m.netProfit>=target)npc='kpi-good';else if(m.netProfit>=target*0.9)npc='kpi-warn';}else if(m.netProfit>0)npc='kpi-good';
    const handleSave=()=>{const name=window.prompt('Save deal as:',deal.address||'Untitled Deal');if(!name)return;saveDeal({...deal,arvNum:arv,purchasePriceNum:purchase,rehabCostNum:rehab,netProfit:m.netProfit,roi:m.roi},name);toast?.show('Deal saved');};
    const handleShare=async()=>{const url=`${window.location.origin}${window.location.pathname}?deal=${encodeDealToUrl(deal)}`;try{await navigator.clipboard.writeText(url);toast?.show('Share URL copied');}catch(e){window.prompt('Copy URL:',url);}};
    const handlePrint=()=>{window.print();};
    return (
        <>
        <aside className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-5 space-y-3 no-print">
            <div className="flex items-center justify-between"><h3 className="text-xs uppercase tracking-wider text-slate-400 headline">Deal Snapshot</h3><Activity className="w-4 h-4 text-amber-400" /></div>
            <div className="flex items-center justify-between"><div><p className="text-xs text-slate-500">Address</p><p className="text-sm text-white truncate">{deal.address||'No address yet'}</p></div>{deal.selectedStrategy&&<span className="text-xs bg-[#0F0F0F] text-slate-300 px-2 py-0.5 rounded capitalize">{deal.selectedStrategy}</span>}</div>
            {hasInputs?(<div className={`p-3 rounded ${npc}`}>
                <p className="text-xs text-slate-400 uppercase">Net Profit</p>
                <p className="text-2xl font-bold accent-num">{formatCurrencySimple(m.netProfit)}</p>
                <div className="grid grid-cols-2 gap-2 text-xs mt-1"><div><p className="text-slate-500">ROI</p><p className="text-white accent-num">{formatPct(m.roi)}</p></div><div><p className="text-slate-500">Margin</p><p className="text-white accent-num">{formatPct(m.profitMargin)}</p></div></div>
            </div>):(<div className="p-3 rounded border border-dashed border-[#333] text-center"><p className="text-xs text-slate-500">Enter ARV and Purchase on Strategy tab to calculate profit</p></div>)}
            {hasInputs?(<div className="bg-[#0F0F0F] rounded p-3 text-center"><p className="text-xs text-slate-500 uppercase">Deal Score</p><p className="text-3xl font-bold gradient-text accent-num">{score.total.toFixed(1)}<span className="text-sm text-slate-500">/100</span></p><p className="text-xs text-slate-400">{score.verdict} ({score.grade})</p></div>):(<div className="bg-[#0F0F0F] rounded p-3 text-center border border-dashed border-[#333]"><p className="text-xs text-slate-500">Score available after deal numbers entered</p></div>)}
            <div className="grid grid-cols-3 gap-1 pt-2"><button onClick={handleSave} className="text-xs bg-[#0F0F0F] hover:bg-[#222] text-white px-2 py-1.5 rounded flex items-center justify-center gap-1"><Save className="w-3 h-3" /> Save</button><button onClick={handlePrint} className="text-xs bg-[#0F0F0F] hover:bg-[#222] text-white px-2 py-1.5 rounded flex items-center justify-center gap-1"><Printer className="w-3 h-3" /> PDF</button><button onClick={handleShare} className="text-xs bg-[#0F0F0F] hover:bg-[#222] text-white px-2 py-1.5 rounded flex items-center justify-center gap-1"><Share2 className="w-3 h-3" /> Share</button></div>
        </aside>
        <MarketSnapshot />
        </>
    );
};

const PipelineDrawer = ({open,onClose,onLoadDeal}) => {
    const {deals,deleteDeal}=useSavedDealsContext();
    const {settings,updateSettings}=useSettings();
    const toast=useToast();
    const [email,setEmail]=useState('');
    useEffect(()=>{if(open){supabase.auth.getUser().then(({data})=>setEmail(data?.user?.email||''));}},[open]);
    const initial=(email||'?').trim().charAt(0).toUpperCase()||'?';
    const handleExportCSV=()=>{
        if(deals.length===0){toast?.show('No deals to export');return;}
        const headers=['Name','Address','ARV','Purchase','Rehab','Net Profit','ROI %','Saved At'];
        const rows=deals.map(d=>[(d.name||'').replace(/"/g,'""'),(d.address||'').replace(/"/g,'""'),Math.round(d.arvNum||parseFloat(d.arv)||0),Math.round(d.purchasePriceNum||parseFloat(d.purchasePrice)||0),Math.round(d.rehabCostNum||0),Math.round(d.netProfit||0),isFinite(d.roi)?d.roi.toFixed(1):'',d.savedAt||'']);
        const csv=[headers,...rows].map(r=>r.map(c=>`"${c}"`).join(',')).join('\n');
        const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});
        const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download=`unshakable-pipeline-${new Date().toISOString().slice(0,10)}.csv`;document.body.appendChild(link);link.click();document.body.removeChild(link);
        toast?.show('CSV exported');
    };
    const handleDelete=(id,name)=>{if(window.confirm(`Delete "${name}"?`)){deleteDeal(id);toast?.show('Deal deleted');}};
    return (
        <>
            <div className={`drawer-backdrop ${open?'open':''}`} onClick={onClose} />
            <aside className={`drawer-panel ${open?'open':''}`} role="dialog" aria-label="Your profile">
                <header className="p-4 border-b border-[#2A2A2A] flex items-center justify-between"><h2 className="text-lg font-bold headline gradient-text">Your Profile</h2><button onClick={onClose} className="icon-btn p-2 rounded hover:bg-[#0F0F0F]" aria-label="Close"><X className="w-5 h-5" /></button></header>
                <div className="p-4 border-b border-[#2A2A2A] flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full fire-bg flex items-center justify-center text-black font-extrabold headline text-lg flex-shrink-0">{initial}</div>
                    <div className="min-w-0 flex-1"><p className="text-sm text-white font-semibold truncate">{email||'Signed in'}</p><p className="text-xs text-slate-500">{deals.length} saved {deals.length===1?'deal':'deals'}</p></div>
                    <button onClick={()=>supabase.auth.signOut()} className="text-xs text-slate-400 hover:text-white border border-[#2A2A2A] hover:border-[#3A3A3A] rounded px-2.5 py-1.5 flex items-center gap-1.5 flex-shrink-0"><LogOut className="w-3.5 h-3.5" /> Sign out</button>
                </div>
                <div className="p-4 border-b border-[#2A2A2A]">
                    <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">Investor Settings</h3>
                    <div className="space-y-3">
                        <div><label className="text-[11px] uppercase tracking-wider text-slate-500">Cash available</label><input type="number" value={settings?.cash_available??''} onChange={(e)=>updateSettings({cash_available:e.target.value===''?null:parseFloat(e.target.value)})} placeholder="100000" className="w-full px-3 py-2 rounded mt-1 text-sm" /></div>
                        <div><label className="text-[11px] uppercase tracking-wider text-slate-500">Credit tier</label><div className="flex gap-1 mt-1 flex-wrap">{[{k:'firstTimer',l:'First-Timer'},{k:'1-3deals',l:'1-3'},{k:'3+deals',l:'3+'},{k:'10+deals',l:'10+'}].map(t=>(<button key={t.k} onClick={()=>updateSettings({credit_tier:t.k})} className={`text-xs px-2.5 py-1 rounded ${(settings?.credit_tier||'1-3deals')===t.k?'fire-bg text-black font-bold':'bg-[#0F0F0F] text-slate-300'}`}>{t.l}</button>))}</div></div>
                        <div><label className="text-[11px] uppercase tracking-wider text-slate-500">Target wholesale fee</label><input type="number" value={settings?.target_assignment_fee??''} onChange={(e)=>updateSettings({target_assignment_fee:e.target.value===''?null:parseFloat(e.target.value)})} placeholder="15000" className="w-full px-3 py-2 rounded mt-1 text-sm" /></div>
                    </div>
                    <p className="text-[10px] text-slate-600 mt-2">Saved to your account and applied to every deal.</p>
                </div>
                <div className="p-4 border-b border-[#2A2A2A] flex items-center justify-between"><h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Saved Deals</h3><button onClick={handleExportCSV} className="text-xs bg-[#0F0F0F] hover:bg-[#222] text-white px-3 py-1.5 rounded flex items-center gap-1.5"><Download className="w-3.5 h-3.5" /> Export CSV</button></div>
                <div className="flex-1 overflow-auto p-4 space-y-2">
                    {deals.length===0?(<div className="text-center py-12"><div className="w-12 h-12 rounded-full bg-[#0F0F0F] border border-[#2A2A2A] flex items-center justify-center mx-auto mb-3"><FolderOpen className="w-5 h-5 text-slate-600" /></div><p className="text-sm text-slate-400 font-medium">No saved deals yet</p><p className="text-xs text-slate-600 mt-1">Build a deal and hit Save to see it here.</p></div>):deals.map(d=>(
                        <div key={d.id} className="bg-[#0F0F0F] rounded-lg p-3 border border-[#2A2A2A] hover:border-[#3A3A3A] transition-colors">
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1"><p className="font-semibold text-white truncate">{d.name}</p><p className="text-xs text-slate-500 truncate">{d.address||'No address'}</p></div>
                                <div className="flex gap-1"><button onClick={()=>onLoadDeal(d)} className="p-1.5 rounded hover:bg-[#1A1A1A]" aria-label="Load deal"><FolderOpen className="w-4 h-4 text-amber-400" /></button><button onClick={()=>handleDelete(d.id,d.name)} className="p-1.5 rounded hover:bg-[#1A1A1A]" aria-label="Delete deal"><Trash2 className="w-4 h-4 text-red-400" /></button></div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 mt-2 text-xs"><div><p className="text-slate-500">ARV</p><p className="text-white accent-num">{formatCurrencySimple(d.arvNum||parseFloat(d.arv)||0)}</p></div><div><p className="text-slate-500">Profit</p><p className="text-white accent-num">{formatCurrencySimple(d.netProfit||0)}</p></div><div><p className="text-slate-500">ROI</p><p className="text-white accent-num">{isFinite(d.roi)?formatPct(d.roi):'N/A'}</p></div></div>
                        </div>
                    ))}
                </div>
                <footer className="p-3 text-xs text-slate-500 border-t border-[#2A2A2A]">Saved deals sync securely to your account.</footer>
            </aside>
        </>
    );
};

const HomePage = ({onChangeView}) => {
    const {deal,resetDeal}=useDeal();
    const {deals}=useSavedDealsContext();
    const hasCurrent=deal.address||Object.keys(deal.selectedItems||{}).filter(k=>deal.selectedItems[k]).length>0;
    const handleNew=()=>{if(hasCurrent&&!window.confirm('Start a new deal? Your current deal will be cleared. Save it first if you want to keep it.'))return;resetDeal();onChangeView(View.RehabEstimator);};
    const loadDeal=(d)=>{window.dispatchEvent(new CustomEvent('loadDeal',{detail:d}));onChangeView(View.RehabEstimator);};
    const scored=useMemo(()=>deals.map(d=>{const sc=computeDealScore(d);return {...d,_score:sc.total,_verdict:sc.verdict};}),[deals]);
    const kpis=useMemo(()=>{const n=scored.length;const best=n?Math.max(...scored.map(d=>d.netProfit||0)):0;const avg=n?Math.round(scored.reduce((a,d)=>a+(d._score||0),0)/n):0;const buys=scored.filter(d=>d._verdict==='BUY').length;return {n,best,avg,buys};},[scored]);
    const today=new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});
    const resume=deals[0]||null;
    const stages=[{name:'Rehab scope',view:View.RehabEstimator},{name:'Analysis',view:View.StrategyAnalyzer},{name:'Financing',view:View.FinancingProfit},{name:'Score',view:View.DealScore}];
    const chip=(v)=>v==='BUY'?'bg-emerald-500/10 text-emerald-300 border-emerald-500/30':v==='WAIT'?'bg-amber-500/10 text-amber-300 border-amber-500/30':'bg-red-500/10 text-red-300 border-red-500/30';
    const Kpi=({n,l})=>(<div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3"><p className="accent-num text-xl font-extrabold text-white">{n}</p><p className="text-[11px] uppercase tracking-wider text-slate-500 mt-0.5">{l}</p></div>);
    return (
        <div className="max-w-7xl mx-auto px-4 py-8 eo-stagger">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                <div><p className="text-xs uppercase tracking-widest text-amber-400">{today}</p><h1 className="text-3xl font-extrabold headline text-white mt-1">Welcome back</h1></div>
                <button onClick={handleNew} className="fire-bg text-black font-extrabold uppercase tracking-wider px-6 py-3.5 rounded-lg headline hover:opacity-90">+ Start a new deal</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                <Kpi n={kpis.n} l="Saved deals" />
                <Kpi n={kpis.best>0?formatCurrencySimple(kpis.best):'\u2014'} l="Best profit" />
                <Kpi n={kpis.n?kpis.avg:'\u2014'} l="Avg score" />
                <Kpi n={kpis.buys} l="Buy-rated" />
            </div>
            <div className="grid lg:grid-cols-12 gap-6">
                <section className="lg:col-span-8 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#2A2A2A]"><h2 className="text-sm uppercase tracking-wider text-slate-300 headline">Pipeline</h2><span className="text-xs text-slate-500">{kpis.n} {kpis.n===1?'deal':'deals'}</span></div>
                    {scored.length===0?(
                        <div className="text-center py-16 px-6"><div className="w-14 h-14 rounded-full bg-[#0F0F0F] border border-[#2A2A2A] flex items-center justify-center mx-auto mb-4"><FolderOpen className="w-6 h-6 text-slate-600" /></div><p className="text-white font-semibold">No deals yet</p><p className="text-sm text-slate-500 mt-1 mb-5">Start your first deal and it will show up here.</p><button onClick={handleNew} className="fire-bg text-black font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg text-sm hover:opacity-90">Start a new deal</button></div>
                    ):(
                        <div className="overflow-x-auto"><table className="w-full text-sm">
                            <thead><tr className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-[#2A2A2A]"><th className="text-left font-medium py-2.5 pl-5">Deal</th><th className="text-right font-medium">ARV</th><th className="text-right font-medium">Profit</th><th className="text-right font-medium">Score</th><th className="text-right font-medium pr-5">Verdict</th></tr></thead>
                            <tbody>{scored.map(d=>(
                                <tr key={d.id} onClick={()=>loadDeal(d)} className="border-b border-[#1f1f1f] hover:bg-[#202020] cursor-pointer">
                                    <td className="py-3 pl-5"><p className="font-semibold text-white truncate max-w-[240px]">{d.name}</p><p className="text-xs text-slate-500 truncate max-w-[240px]">{d.address||'No address'}</p></td>
                                    <td className="text-right accent-num text-slate-200 whitespace-nowrap">{formatCurrencySimple(d.arvNum||parseFloat(d.arv)||0)}</td>
                                    <td className={`text-right accent-num whitespace-nowrap ${(d.netProfit||0)>=0?'text-amber-400':'text-red-400'}`}>{formatCurrencySimple(d.netProfit||0)}</td>
                                    <td className="text-right accent-num text-slate-200">{d._score.toFixed(0)}</td>
                                    <td className="text-right pr-5"><span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${chip(d._verdict)}`}>{d._verdict}</span></td>
                                </tr>))}
                            </tbody>
                        </table></div>
                    )}
                </section>
                <aside className="lg:col-span-4 space-y-4">
                    {(resume||hasCurrent)&&(<div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5"><p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Resume</p><p className="font-semibold text-white truncate">{resume?resume.name:(deal.address||'Current deal')}</p><p className="text-xs text-slate-500 truncate mb-4">{resume?(resume.address||'No address'):(deal.address||'In progress')}</p><button onClick={()=>resume?loadDeal(resume):onChangeView(View.RehabEstimator)} className="w-full fire-bg text-black font-bold uppercase tracking-wider py-2.5 rounded-lg text-sm hover:opacity-90">Continue</button></div>)}
                    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5">
                        <p className="text-[11px] uppercase tracking-wider text-slate-500 mb-3">Workflow</p>
                        {stages.map((st,i)=>(<button key={st.name} onClick={()=>onChangeView(st.view)} className="w-full flex items-center gap-3 py-2 group text-left"><div className="w-7 h-7 rounded-lg fire-bg text-black flex items-center justify-center font-extrabold accent-num text-xs flex-shrink-0">{i+1}</div><span className="text-sm text-slate-200 group-hover:text-white">{st.name}</span><ChevronDown className="w-4 h-4 text-amber-400 -rotate-90 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" /></button>))}
                    </div>
                    <div className="bg-[#0F0F0F] border border-[#262626] rounded-2xl p-5"><div className="grid grid-cols-2 gap-3 text-center">
                        <div><p className="accent-num text-lg font-extrabold gradient-text">62</p><p className="text-[10px] uppercase tracking-wider text-slate-500">Rehab items</p></div>
                        <div><p className="accent-num text-lg font-extrabold gradient-text">41</p><p className="text-[10px] uppercase tracking-wider text-slate-500">Metros</p></div>
                        <div><p className="accent-num text-lg font-extrabold gradient-text">9</p><p className="text-[10px] uppercase tracking-wider text-slate-500">Scenarios</p></div>
                        <div><p className="accent-num text-lg font-extrabold gradient-text">20</p><p className="text-[10px] uppercase tracking-wider text-slate-500">Metrics</p></div>
                    </div></div>
                </aside>
            </div>
        </div>
    );
};

const RehabEstimator = ({onChangeView}) => {
    const {deal,updateDeal}=useDeal();
    const toast=useToast();
    const [zipLoading,setZipLoading]=useState(false);
    const [expandedCategories,setExpandedCategories]=useState(new Set(['General Interior']));
    const [customDraft,setCustomDraft]=useState({});
    const computed=useMemo(()=>computeRehabCost(deal),[deal]);
    useEffect(()=>{if(computed.totalRehabCost!==deal.totalRehabCost||computed.rehabEstimation!==deal.rehabEstimation||computed.finalEstimation!==deal.finalEstimation){updateDeal({totalRehabCost:computed.totalRehabCost,rehabEstimation:computed.rehabEstimation,finalEstimation:computed.finalEstimation});}},[computed.totalRehabCost,computed.rehabEstimation,computed.finalEstimation]);
    const animBase=useCountUp(computed.totalRehabCost);
    const animMetro=useCountUp(computed.rehabEstimation);
    const animFinal=useCountUp(computed.finalEstimation);
    const handleZipBlur=async()=>{if(!/^\d{5}$/.test(deal.zip))return;setZipLoading(true);const r=await lookupMetroByZip(deal.zip);setZipLoading(false);if(r){updateDeal({metroDisplay:r.metro,metroMultiplier:r.multiplier,metroRegion:r.region,stateAbbr:r.state});toast?.show(`Metro: ${r.metro.split(',')[0]}`);}else{toast?.show('ZIP not found');}};
    const applyPreset=(k)=>{const p=QUICK_SCOPE_PRESETS[k];if(!p)return;const hasScope=Object.keys(deal.selectedItems||{}).some(id=>deal.selectedItems[id]);if(hasScope&&!window.confirm(`Apply "${p.name}" preset? This will replace your current rehab scope.`))return;const ns={};p.items.forEach(id=>{ns[id]=true;});updateDeal({selectedItems:ns,itemPercentages:p.percentages||{},itemQuantities:p.quantities||{},selectedQualities:p.qualities||{},bathsToRemodel:p.bathsToRemodel||'1'});toast?.show(`Applied: ${p.name}`);};
    const toggleItem=(id)=>updateDeal(p=>({...p,selectedItems:{...p.selectedItems,[id]:!p.selectedItems?.[id]}}));
    const setItemPct=(id,v)=>updateDeal(p=>({...p,itemPercentages:{...p.itemPercentages,[id]:v}}));
    const setItemQty=(id,v)=>updateDeal(p=>({...p,itemQuantities:{...p.itemQuantities,[id]:v}}));
    const setQuality=(g,o)=>updateDeal(p=>({...p,selectedQualities:{...p.selectedQualities,[g]:o}}));
    const addCustomItem=(c)=>{const d=customDraft[c]||{name:'',cost:''};if(!d.name||!d.cost){toast?.show('Enter name and cost');return;}updateDeal(p=>{const l=(p.customItems||{})[c]||[];return {...p,customItems:{...(p.customItems||{}),[c]:[...l,{id:`custom_${Date.now()}`,name:d.name,cost:d.cost}]}};});setCustomDraft(p=>({...p,[c]:{name:'',cost:''}}));};
    const removeCustomItem=(c,id)=>updateDeal(p=>{const l=((p.customItems||{})[c]||[]).filter(i=>i.id!==id);return {...p,customItems:{...(p.customItems||{}),[c]:l}};});
    const sqft=parseFloat(deal.sqft)||0;
    const arv=parseFloat(deal.arv)||0;
    const rehabPerSqft=sqft>0?computed.finalEstimation/sqft:0;
    const profitMargin=arv>0?((arv-parseFloat(deal.purchasePrice||0)-computed.finalEstimation)/arv)*100:0;
    const costBasisOfArv=arv>0?((parseFloat(deal.purchasePrice||0)+computed.finalEstimation)/arv)*100:0;
    const purchaseVal=parseFloat(deal.purchasePrice||0);
    const netProfit=arv-purchaseVal-computed.finalEstimation-(arv*0.075);
    const hasInputs=arv>0&&purchaseVal>0;
    const cm=hasInputs?COACHING_RULES.find(r=>r.test({sqft,rehabPerSqft,profitMargin,costBasisOfArv,netProfit})):null;
    const coachingMessage=cm?cm.message({sqft,rehabPerSqft,profitMargin,costBasisOfArv,netProfit}):null;
    const noScope=Object.keys(deal.selectedItems||{}).filter(k=>deal.selectedItems[k]).length===0;
    const categories=['General Interior','General Exterior','Major Systems & Utilities','Kitchen Remodel','Bathroom Remodel'];
    const renderItemRow=(item)=>{const sel=!!(deal.selectedItems||{})[item.id];return (<div key={item.id} className={`flex items-center justify-between gap-2 py-2 px-2 rounded ${sel?'bg-[#0F0F0F]':''} hover:bg-[#0F0F0F]`}><label className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer"><input type="checkbox" checked={sel} onChange={()=>toggleItem(item.id)} className="w-4 h-4 accent-amber-500 flex-shrink-0" /><span className="text-sm text-white truncate">{item.name}</span></label>{sel&&item.type==='sqft'&&item.areaType==='percentage'&&(<select value={(deal.itemPercentages||{})[item.id]||'100'} onChange={(e)=>setItemPct(item.id,e.target.value)} className="text-xs px-1.5 py-1 rounded bg-[#1A1A1A] border border-[#333]"><option value="25">25%</option><option value="50">50%</option><option value="75">75%</option><option value="100">100%</option></select>)}{sel&&(item.type==='item'||item.type==='linear_ft')&&(<input type="number" min="0" value={(deal.itemQuantities||{})[item.id]||''} onChange={(e)=>setItemQty(item.id,e.target.value)} placeholder={item.label||'qty'} className="w-20 text-xs px-2 py-1 rounded" />)}<span className="text-xs text-amber-400 accent-num w-20 text-right">{formatCurrencySimple(item.cost)}{item.type==='sqft'?'/sf':''}</span></div>);};
    const renderGroup=(gid)=>{const g=itemGroups[gid];const sel=!!(deal.selectedItems||{})[gid];const co=(deal.selectedQualities||{})[gid]||g.default;return (<div key={gid} className={`py-2 px-2 rounded ${sel?'bg-[#0F0F0F]':''}`}><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={sel} onChange={()=>toggleItem(gid)} className="w-4 h-4 accent-amber-500" /><span className="text-sm font-semibold text-white">{g.name}</span></label>{sel&&(<div className="mt-1 ml-6 flex gap-1 flex-wrap">{g.options.map(oid=>{const op=rehabItemMap[oid];const lb=op.name.match(/\(([^)]+)\)/)?.[1]||op.name;return (<button key={oid} onClick={()=>setQuality(gid,oid)} className={`text-xs px-2 py-1 rounded ${co===oid?'fire-bg text-black font-bold':'bg-[#1A1A1A] text-slate-300 hover:bg-[#222]'}`}>{lb} <span className="opacity-70">({formatCurrencySimple(op.cost)})</span></button>);})}</div>)}</div>);};
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A]">
                    <h2 className="text-xl font-bold headline gradient-text mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-amber-400" /> Property Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2"><label className="text-xs text-slate-400 uppercase">Address</label><input type="text" value={deal.address} onChange={(e)=>updateDeal({address:e.target.value})} placeholder="123 Main St" className="w-full px-3 py-2 rounded mt-1" /></div>
                        <div><label className="text-xs text-slate-400 uppercase">ZIP {zipLoading&&<span className="text-amber-400">(looking up...)</span>}</label><input type="text" value={deal.zip} onChange={(e)=>updateDeal({zip:e.target.value})} onBlur={handleZipBlur} placeholder="75201" className="w-full px-3 py-2 rounded mt-1" />{deal.metroDisplay&&<p className="text-xs text-amber-400 mt-1 truncate">{deal.metroDisplay} ({(deal.metroMultiplier*100).toFixed(0)}% cost index)</p>}</div>
                        <div className="grid grid-cols-3 gap-2">
                            <div><label className="text-xs text-slate-400 uppercase">Beds</label><input type="number" value={deal.beds} onChange={(e)=>updateDeal({beds:e.target.value})} className="w-full px-3 py-2 rounded mt-1" /></div>
                            <div><label className="text-xs text-slate-400 uppercase">Baths</label><input type="number" step="0.5" value={deal.baths} onChange={(e)=>updateDeal({baths:e.target.value})} className="w-full px-3 py-2 rounded mt-1" /></div>
                            <div><label className="text-xs text-slate-400 uppercase">Sqft</label><input type="number" value={deal.sqft} onChange={(e)=>updateDeal({sqft:e.target.value})} className="w-full px-3 py-2 rounded mt-1" /></div>
                        </div>
                    </div>
                </div>
                <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A]">
                    <h2 className="text-xl font-bold headline gradient-text mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-amber-400" /> Quick Scope Presets</h2>
                    {noScope&&<p className="text-xs text-amber-400 mb-2 font-bold uppercase">Start here, pick a preset</p>}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">{Object.entries(QUICK_SCOPE_PRESETS).map(([k,p])=>(<button key={k} onClick={()=>applyPreset(k)} className={`bg-[#0F0F0F] hover:bg-[#222] border ${noScope?'border-amber-500/60':'border-[#2A2A2A]'} hover:border-amber-500 rounded-lg p-4 text-left transition`}><p className="font-bold text-white">{p.name}</p><p className="text-xs text-slate-400 mt-1">{p.description}</p></button>))}</div>
                </div>
                <div className="sticky top-4 z-10 fire-border rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 headline">Live Cost Meter</h3><Activity className="w-4 h-4 text-amber-400" /></div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div><p className="text-xs text-slate-500 uppercase">Base</p><p className="text-lg accent-num text-white">{formatCurrencySimple(animBase)}</p></div>
                        <div><p className="text-xs text-slate-500 uppercase">Metro Adj</p><p className="text-lg accent-num text-amber-300">{formatCurrencySimple(animMetro)}</p></div>
                        <div><p className="text-xs text-slate-500 uppercase">+10% Final</p><p className="text-2xl accent-num gradient-text font-bold">{formatCurrencySimple(animFinal)}</p></div>
                    </div>
                    {sqft>0&&computed.finalEstimation>0&&(<p className="text-xs text-slate-400 text-center mt-2">${(computed.finalEstimation/sqft).toFixed(0)}/sqft</p>)}
                </div>
                {coachingMessage&&(<div className="rounded-xl p-4 bg-amber-500/10 border border-amber-500/40 flex items-start gap-3"><Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" /><p className="text-sm text-amber-100">{coachingMessage}</p></div>)}
                <div className="space-y-3">
                    {categories.map(cat=>{
                        const ic=REHAB_ITEMS.filter(i=>i.category===cat);
                        const gc=Object.keys(itemGroups).filter(g=>{const o=itemGroups[g].options;return o.some(oo=>rehabItemMap[oo]?.category===cat);});
                        const isO=expandedCategories.has(cat);
                        return (<div key={cat} className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] overflow-hidden">
                            <button onClick={()=>setExpandedCategories(prev=>{const n=new Set(prev);if(n.has(cat))n.delete(cat);else n.add(cat);return n;})} className="w-full flex items-center justify-between p-4 hover:bg-[#0F0F0F]"><h3 className="font-bold text-white headline">{cat}</h3><ChevronDown className={`w-5 h-5 text-amber-400 transition-transform ${isO?'rotate-180':''}`} /></button>
                            {isO&&(<div className="p-3 border-t border-[#2A2A2A] space-y-1">
                                {cat==='Bathroom Remodel'&&(<div className="bg-[#0F0F0F] rounded p-3 mb-2 flex items-center justify-between"><span className="text-xs uppercase text-slate-400">Bathrooms to remodel</span><input type="number" min="0" max="6" value={deal.bathsToRemodel} onChange={(e)=>updateDeal({bathsToRemodel:e.target.value})} className="w-16 px-2 py-1 rounded text-center" /></div>)}
                                {gc.map(g=>renderGroup(g))}
                                {ic.filter(i=>!Object.values(itemGroups).some(g=>g.options.includes(i.id))).map(renderItemRow)}
                                <div className="border-t border-[#2A2A2A] mt-3 pt-3">
                                    <p className="text-xs uppercase text-slate-500 mb-2">Custom Items</p>
                                    {((deal.customItems||{})[cat]||[]).map(ci=>(<div key={ci.id} className="flex items-center justify-between gap-2 py-1 px-2"><span className="text-sm text-white flex-1 truncate">{ci.name}</span><span className="text-sm accent-num text-amber-400">{formatCurrencySimple(parseFloat(ci.cost)||0)}</span><button onClick={()=>removeCustomItem(cat,ci.id)} className="text-red-400 hover:text-red-300"><X className="w-4 h-4" /></button></div>))}
                                    <div className="flex gap-2 mt-2"><input type="text" placeholder="Item name" value={(customDraft[cat]||{}).name||''} onChange={(e)=>setCustomDraft(p=>({...p,[cat]:{...(p[cat]||{}),name:e.target.value}}))} className="flex-1 px-2 py-1 rounded text-sm" /><input type="number" placeholder="$" value={(customDraft[cat]||{}).cost||''} onChange={(e)=>setCustomDraft(p=>({...p,[cat]:{...(p[cat]||{}),cost:e.target.value}}))} className="w-24 px-2 py-1 rounded text-sm" /><button onClick={()=>addCustomItem(cat)} className="px-3 py-1 bg-amber-500 text-black rounded text-sm font-bold">+</button></div>
                                </div>
                            </div>)}
                        </div>);
                    })}
                </div>
                <button onClick={()=>onChangeView&&onChangeView(View.StrategyAnalyzer)} className="w-full fire-bg text-black font-extrabold uppercase tracking-wider py-4 rounded-lg headline hover:opacity-90 flex items-center justify-center gap-2 mt-2">Continue to Analysis <ChevronDown className="w-5 h-5 -rotate-90" /></button>
            </div>
            <div className="lg:col-span-1"><div className="lg:sticky lg:top-4"><DealSnapshotRail /></div></div>
        </div>
    );
};

const StrategyAnalyzer = ({onChangeView}) => {
    const {deal,updateDeal}=useDeal();
    const toast=useToast();
    const N=(v)=>parseFloat(v)||0;
    const arvN=N(deal.arv), purchaseN=N(deal.purchasePrice);
    const ready=arvN>0&&purchaseN>0;
    const [view,setView]=useState('flip');
    const scenarios=useMemo(()=>computeStrategyScenarios(deal),[deal]);
    const ecoDeps=[deal.arv,deal.purchasePrice,deal.finalEstimation,deal.totalRehabCost,deal.metroDisplay,deal.ltv,deal.interestRate,deal.computedDurationDays,deal.holdMonthsOverride];
    const eco=useMemo(()=>dealEconomics(deal),ecoDeps);
    const score=useMemo(()=>computeDealScore(deal),[deal]);
    const target=N(deal.targetProfit);
    const sens=useMemo(()=>computeSensitivity(deal),ecoDeps);
    const mc=useMemo(()=>computeMonteCarlo(deal,target),[...ecoDeps,target]);
    const restrictedStates=['CT','MD','PA','TN','OK','ND','IL','SC','OR','VA'];
    const stateAbbr=deal.stateAbbr||''; const isRestricted=restrictedStates.includes(stateAbbr);
    const recommendation=useMemo(()=>{const c=parseFloat(deal.userCashAvailable)||0;const t=deal.creditTier||'1-3deals';const r=deal.riskTolerance||'balanced';let s2='flip';let sb='market';if(c>0&&c<50000){s2='wholesale';sb=r==='aggressive'?'aggressive':'market';}else if(c>=200000&&(METRO_BENCHMARKS[deal.metroDisplay]?.flipROI||25.5)<15){s2='rental';sb='market';}else if(t==='firstTimer'){s2='flip';sb='conservative';}else{s2='flip';sb=r==='aggressive'?'aggressive':(r==='conservative'?'conservative':'market');}return {strategy:s2,sub:sb};},[deal.userCashAvailable,deal.creditTier,deal.riskTolerance,deal.metroDisplay]);
    const selectScenario=(st,sb)=>{updateDeal({selectedStrategy:st,selectedSubScenario:sb});toast?.show(`Strategy: ${st} (${sb})`);};
    const kfmt=(v)=>`${v<0?'-':''}$${Math.abs(Math.round(v/1000))}k`;
    const cellColor=(v)=>{const mag=Math.max(Math.abs(sens.base),20000);const a=Math.min(Math.abs(v)/mag,1)*0.45+0.08;return v>=0?`rgba(16,185,129,${a})`:`rgba(239,68,68,${a})`;};
    const renderGrid=(title,rowD,colD,data,colName,rowFmt,colFmt)=>(<div><p className="text-xs uppercase tracking-wider text-slate-400 mb-2">{title}</p><div className="overflow-x-auto"><table className="w-full text-[11px] border-separate" style={{borderSpacing:'2px'}}><thead><tr><th className="p-1 text-slate-600 font-medium text-left whitespace-nowrap">ARV / {colName}</th>{colD.map((c,j)=><th key={j} className="p-1 text-slate-400 font-medium accent-num">{colFmt(c)}</th>)}</tr></thead><tbody>{rowD.map((r,i)=>(<tr key={i}><td className="p-1 text-slate-400 accent-num whitespace-nowrap">{rowFmt(r)}</td>{colD.map((c,j)=>{const v=data[i][j];const cur=r===0&&c===0;return <td key={j} className="p-1 text-center accent-num text-white rounded" style={{background:cellColor(v),outline:cur?'2px solid #FFD700':'none'}}>{kfmt(v)}</td>;})}</tr>))}</tbody></table></div></div>);
    const renderCard=(s)=>{const sel=deal.selectedStrategy===s.strategy&&deal.selectedSubScenario===s.subScenario;const scenarioProfit=s.strategy==='flip'?s.netProfit:(s.strategy==='rental'?s.cashFlow:(s.assignmentFee||0));const isProfitable=scenarioProfit>0;const best=recommendation.strategy===s.strategy&&recommendation.sub===s.subScenario&&isProfitable;const showR=s.strategy==='wholesale'&&isRestricted;return (<button key={`${s.strategy}-${s.subScenario}`} onClick={()=>selectScenario(s.strategy,s.subScenario)} className={`text-left bg-[#1A1A1A] hover:bg-[#222] rounded-xl p-4 border-2 transition relative ${sel?'border-amber-500':'border-[#2A2A2A]'} ${best?'ring-best':''}`}>{sel&&<Check className="absolute top-2 left-2 w-5 h-5 text-amber-400" />}{best&&<span className="absolute -top-2 -right-2 bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded">BEST FIT</span>}{!isProfitable&&s.strategy==='flip'&&ready&&<div className="bg-red-500/10 border border-red-500/40 rounded p-2 mb-2"><p className="text-xs text-red-300 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Negative profit. Renegotiate or cut scope.</p></div>}<div className="flex items-center justify-between mb-2 mt-1"><p className="text-xs uppercase text-slate-400 capitalize">{s.strategy}</p><p className="text-xs font-bold text-amber-300">{s.label}</p></div>{showR&&(<div className="bg-yellow-500/10 border border-yellow-500/40 rounded p-2 mb-2"><p className="text-xs text-yellow-200 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Wholesaling regulated in {stateAbbr}.</p></div>)}{s.strategy==='wholesale'&&(<><p className="text-2xl font-bold accent-num gradient-text">{formatCurrencySimple(s.assignmentFee)}</p><p className="text-xs text-slate-400">Assignment fee</p><div className="mt-2 grid grid-cols-3 gap-1 text-xs"><div><p className="text-slate-500">Cash</p><p className="text-white accent-num">{formatCurrencySimple(s.cashRequired)}</p></div><div><p className="text-slate-500">Days</p><p className="text-white accent-num">{s.timeToClose}</p></div><div><p className="text-slate-500">Risk</p><p className="text-white accent-num">{s.risk}/5</p></div></div></>)}{s.strategy==='rental'&&(<><p className="text-2xl font-bold accent-num gradient-text">{formatCurrencySimple(s.cashFlow)}</p><p className="text-xs text-slate-400">Annual cash flow</p><div className="mt-2 grid grid-cols-3 gap-1 text-xs"><div><p className="text-slate-500">Cap</p><p className="text-white accent-num">{formatPct(s.capRate,1)}</p></div><div><p className="text-slate-500">CoC</p><p className="text-white accent-num">{formatPct(s.coc,1)}</p></div><div><p className="text-slate-500">DSCR</p><p className="text-white accent-num">{(s.dscr||0).toFixed(2)}</p></div></div></>)}{s.strategy==='flip'&&(<><p className="text-2xl font-bold accent-num gradient-text">{formatCurrencySimple(s.netProfit)}</p><p className="text-xs text-slate-400">Net profit</p><div className="mt-2 grid grid-cols-3 gap-1 text-xs"><div><p className="text-slate-500">ROI</p><p className="text-white accent-num">{formatPct(s.roi,0)}</p></div><div><p className="text-slate-500">Ann ROI</p><p className="text-white accent-num">{formatPct(s.annualizedRoi,0)}</p></div><div><p className="text-slate-500">Months</p><p className="text-white accent-num">{s.months.toFixed(1)}</p></div></div></>)}<p className="text-xs text-slate-500 mt-2 italic">{s.assumptions}</p></button>);};
    const sectionHeader=(label,strategyKey)=>{const stratScenarios=(scenarios[strategyKey]||[]);const bestScenario=stratScenarios.find(s=>s.strategy===recommendation.strategy&&s.subScenario===recommendation.sub);const recProfit=bestScenario?(bestScenario.strategy==='flip'?bestScenario.netProfit:(bestScenario.strategy==='rental'?bestScenario.cashFlow:(bestScenario.assignmentFee||0))):0;const showRec=recommendation.strategy===strategyKey&&recProfit>0;return (<div className="flex items-center gap-2 mb-2"><p className="text-sm uppercase tracking-wider text-slate-300 font-bold headline">{label}</p>{showRec&&<span className="text-xs bg-amber-500 text-black px-2 py-0.5 rounded font-bold">RECOMMENDED</span>}</div>);};
    const stat3=(v,good,ok,hb=true)=>{const g=hb?v>=good:v<=good;const o=hb?v>=ok:v<=ok;return g?'good':o?'ok':'bad';};
    const SB={good:'kpi-good',ok:'kpi-warn',bad:'kpi-bad'};
    const vColor=score.verdict==='BUY'?'text-emerald-300 border-emerald-500/40 bg-emerald-500/10':score.verdict==='WAIT'?'text-amber-300 border-amber-500/40 bg-amber-500/10':'text-red-300 border-red-500/40 bg-red-500/10';
    const overMao=purchaseN-eco.mao70;
    const sub=[{id:'summary',l:'Summary'},{id:'adjust',l:'Adjust'},{id:'economics',l:'Economics'},{id:'offer',l:'Offer'},{id:'scenarios',l:'Scenarios'},{id:'risk',l:'Risk'}];
    const Ratio=({label,value,status,note})=>(<div className={`rounded-lg p-3 ${SB[status]}`}><p className="text-[10px] uppercase tracking-wider text-slate-400">{label}</p><p className="text-lg font-extrabold accent-num text-white">{value}</p><p className="text-[10px] text-slate-500">{note}</p></div>);
    const ecoRows=[{l:'Purchase',v:eco.purchase},{l:'Rehab',v:eco.rehab},{l:'Financing',v:eco.financing},{l:'Holding',v:eco.holding},{l:'Closing',v:eco.closing},{l:'Selling',v:eco.selling}];
    const lever=(label,valLabel,node)=>(<div><div className="flex justify-between text-xs mb-1"><span className="uppercase tracking-wider text-slate-400">{label}</span><span className="accent-num text-white">{valLabel}</span></div>{node}</div>);
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
                <div className="sticky top-0 z-10 bg-[#050505]/90 backdrop-blur py-2 no-print"><div className="flex gap-1 overflow-x-auto">{sub.map(x=>(<a key={x.id} href={`#an-${x.id}`} className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 hover:text-white px-3 py-1.5 rounded hover:bg-[#1A1A1A] whitespace-nowrap">{x.l}</a>))}</div></div>

                <div id="an-summary" className="scroll-mt-24 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    <div><p className="text-[10px] uppercase tracking-wider text-slate-500">Net profit (flip)</p><p className={`text-3xl font-extrabold accent-num ${eco.net>=0?'gradient-text':'text-red-400'}`}>{ready?formatCurrencySimple(eco.net):'—'}</p><p className="text-xs text-slate-400">{ready?`${eco.marginPct.toFixed(1)}% margin · ${eco.roi.toFixed(0)}% ROI`:'Enter ARV + purchase to analyze'}</p></div>
                    <div className="text-center"><span className={`inline-block text-sm font-extrabold uppercase tracking-wider px-4 py-2 rounded-lg border ${vColor}`}>{score.verdict}</span><p className="text-xs text-slate-500 mt-1 accent-num">Score {score.total.toFixed(0)}/100 ({score.grade})</p></div>
                    <div className="sm:text-right"><p className="text-[10px] uppercase tracking-wider text-slate-500">70% rule max offer</p><p className="text-xl font-extrabold accent-num text-white">{ready?formatCurrencySimple(eco.mao70):'—'}</p>{ready&&<p className={`text-xs ${overMao>0?'text-red-300':'text-emerald-300'}`}>{overMao>0?`${formatCurrencySimple(overMao)} over max`:`${formatCurrencySimple(-overMao)} under max`}</p>}</div>
                </div>

                <div id="an-adjust" className="scroll-mt-24 space-y-4">
                    <div data-section="deal-numbers" className="bg-[#1A1A1A] p-6 rounded-xl border-2 border-amber-500/40">
                        <h2 className="text-xl font-bold headline gradient-text mb-2 flex items-center gap-2"><DollarSign className="w-5 h-5" /> Deal Numbers</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div><label className="text-xs uppercase text-slate-400 font-bold">Purchase Price</label><input type="number" value={deal.purchasePrice} onChange={(e)=>updateDeal({purchasePrice:e.target.value})} placeholder="e.g. 220000" className="w-full px-3 py-2 rounded mt-1 text-lg accent-num" /></div>
                            <div><label className="text-xs uppercase text-slate-400 font-bold">After-Repair Value (ARV)</label><input type="number" value={deal.arv} onChange={(e)=>updateDeal({arv:e.target.value})} placeholder="e.g. 350000" className="w-full px-3 py-2 rounded mt-1 text-lg accent-num" /></div>
                            <div><label className="text-xs uppercase text-slate-400 font-bold">Rehab (auto)</label><div className="w-full px-3 py-2 rounded mt-1 text-lg accent-num bg-[#0F0F0F] text-slate-400">{formatCurrencySimple(parseFloat(deal.finalEstimation)||parseFloat(deal.totalRehabCost)||computeRehabCost(deal).finalEstimation)}</div><p className="text-xs text-slate-500 mt-1">From Rehab tab</p></div>
                        </div>
                    </div>
                    <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A]">
                        <h3 className="headline text-white mb-4 flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-amber-400" /> Adjust the deal</h3>
                        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                            {lever('Purchase price',formatCurrencySimple(purchaseN),<input type="range" min="0" max={Math.max(Math.round(arvN)||500000,1000)} step="1000" value={purchaseN} onChange={(e)=>updateDeal({purchasePrice:e.target.value})} className="w-full" />)}
                            {lever('ARV',formatCurrencySimple(arvN),<div className="flex gap-1 mt-1">{[-5,-2,2,5].map(p=>(<button key={p} onClick={()=>updateDeal({arv:String(Math.round((arvN||0)*(1+p/100)))})} className="text-xs bg-[#0F0F0F] hover:bg-[#222] text-slate-300 px-2 py-1 rounded flex-1">{p>0?'+':''}{p}%</button>))}</div>)}
                            {lever(`Hold time ${deal.holdMonthsOverride?'(manual)':'(auto)'}`,`${eco.months.toFixed(1)} mo`,<><input type="range" min="1" max="12" step="0.5" value={Math.min(eco.months,12)} onChange={(e)=>updateDeal({holdMonthsOverride:e.target.value})} className="w-full" />{deal.holdMonthsOverride&&<button onClick={()=>updateDeal({holdMonthsOverride:''})} className="text-[10px] text-amber-400 hover:underline">reset to auto</button>}</>)}
                            {lever('Loan-to-value',`${N(deal.ltv)||75}%`,<input type="range" min="60" max="90" step="1" value={N(deal.ltv)||75} onChange={(e)=>updateDeal({ltv:e.target.value})} className="w-full" />)}
                            {lever('Interest rate',`${(N(deal.interestRate)||11).toFixed(2)}%`,<input type="range" min="8" max="14" step="0.25" value={N(deal.interestRate)||11} onChange={(e)=>updateDeal({interestRate:e.target.value})} className="w-full" />)}
                        </div>
                        <div className="flex gap-1 bg-[#0F0F0F] p-1 rounded-lg border border-[#2A2A2A] w-fit mt-5">{[{k:'flip',l:'Fix & Flip'},{k:'rental',l:'Rental'},{k:'wholesale',l:'Wholesale'}].map(o=>(<button key={o.k} onClick={()=>setView(o.k)} className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded ${view===o.k?'fire-bg text-black':'text-slate-400 hover:text-white'}`}>{o.l}</button>))}</div>
                        {view!=='flip'&&(<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#2A2A2A]">
                            {view==='rental'&&<div><label className="text-xs uppercase text-slate-400">Estimated Rent (monthly)</label><input type="number" value={deal.estimatedRent} onChange={(e)=>updateDeal({estimatedRent:e.target.value})} placeholder="Auto from metro" className="w-full px-3 py-2 rounded mt-1" /></div>}
                            {view==='wholesale'&&<><div><label className="text-xs uppercase text-slate-400">Seller Mortgage Balance</label><input type="number" value={deal.sellerMortgageBalance} onChange={(e)=>updateDeal({sellerMortgageBalance:e.target.value})} className="w-full px-3 py-2 rounded mt-1" /></div><div><label className="text-xs uppercase text-slate-400">Seller Rate %</label><input type="number" step="0.1" value={deal.sellerMortgageRate} onChange={(e)=>updateDeal({sellerMortgageRate:e.target.value})} className="w-full px-3 py-2 rounded mt-1" /></div></>}
                        </div>)}
                    </div>
                </div>

                {!ready?(
                    <div className="bg-[#0F0F0F] border border-dashed border-amber-500/40 rounded-xl p-8 text-center"><AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" /><p className="text-sm text-amber-200 font-bold">Enter ARV and Purchase Price to run the analysis</p><p className="text-xs text-slate-400 mt-1">Economics, offer, scenarios, and risk all compute from your deal numbers.</p></div>
                ):(<>
                    {view==='flip'&&<div id="an-economics" className="scroll-mt-24 bg-[#1A1A1A] p-5 rounded-xl border border-[#2A2A2A]">
                        <h3 className="headline text-white mb-1">Deal economics</h3><p className="text-xs text-slate-500 mb-4">Where every dollar goes, from resale value to net profit.</p>
                        <div className="flex items-center justify-between text-sm mb-3"><span className="text-slate-300">ARV (resale value)</span><span className="accent-num text-white font-bold">{formatCurrencySimple(eco.arv)}</span></div>
                        <div className="space-y-2">{ecoRows.map(r=>(<div key={r.l} className="flex items-center gap-3"><span className="text-xs text-slate-400 w-20 flex-shrink-0">{r.l}</span><div className="flex-1 h-2.5 bg-[#0F0F0F] rounded overflow-hidden"><div className="h-full bg-red-500/50" style={{width:`${Math.min((r.v/(eco.arv||1))*100,100)}%`}}></div></div><span className="text-xs accent-num text-red-300 w-20 text-right flex-shrink-0">-{formatCurrencySimple(r.v)}</span></div>))}</div>
                        <div className="flex items-center justify-between border-t border-[#2A2A2A] pt-3 mt-3"><span className="font-bold text-white">Net profit</span><span className={`accent-num text-xl font-extrabold ${eco.net>=0?'gradient-text':'text-red-400'}`}>{formatCurrencySimple(eco.net)}</span></div>
                    </div>}

                    {view==='flip'&&<div id="an-offer" className="scroll-mt-24 space-y-4">
                        <div className="bg-[#1A1A1A] p-5 rounded-xl border border-[#2A2A2A]">
                            <h3 className="headline text-white mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-amber-400" /> Maximum allowable offer</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="bg-[#0F0F0F] rounded-lg p-3"><p className="text-[10px] uppercase tracking-wider text-slate-500">70% rule</p><p className="text-xl font-extrabold accent-num gradient-text">{formatCurrencySimple(eco.mao70)}</p><p className="text-[10px] text-slate-500">70% &times; ARV &minus; rehab</p></div>
                                <div className="bg-[#0F0F0F] rounded-lg p-3"><p className="text-[10px] uppercase tracking-wider text-slate-500">To clear $50K</p><p className="text-xl font-extrabold accent-num text-white">{formatCurrencySimple(eco.maoTarget)}</p><p className="text-[10px] text-slate-500">Min-profit offer</p></div>
                                <div className={`rounded-lg p-3 ${overMao>0?'kpi-bad':'kpi-good'}`}><p className="text-[10px] uppercase tracking-wider text-slate-400">Your offer</p><p className="text-xl font-extrabold accent-num text-white">{formatCurrencySimple(purchaseN)}</p><p className="text-[10px] text-slate-500">{overMao>0?`${formatCurrencySimple(overMao)} over 70% max`:`${formatCurrencySimple(-overMao)} under max`}</p></div>
                            </div>
                            <button onClick={()=>updateDeal({purchasePrice:String(Math.max(Math.round(eco.mao70),0))})} className="mt-3 text-xs fire-bg text-black font-bold px-4 py-2 rounded hover:opacity-90">Set offer to 70% max</button>
                        </div>
                        <div className="bg-[#1A1A1A] p-5 rounded-xl border border-[#2A2A2A]">
                            <h3 className="headline text-white mb-3">Underwriting ratios</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <Ratio label="Profit margin" value={`${eco.marginPct.toFixed(1)}%`} status={stat3(eco.marginPct,20,10)} note="target 20%+" />
                                <Ratio label="Gross spread" value={`${eco.grossSpreadPct.toFixed(1)}%`} status={stat3(eco.grossSpreadPct,30,25)} note="70% rule = 30%" />
                                <Ratio label="Cost basis / ARV" value={`${eco.costBasisPct.toFixed(1)}%`} status={stat3(eco.costBasisPct,70,75,false)} note="70% rule cap" />
                                <Ratio label="Net profit" value={formatCurrencySimple(eco.net)} status={stat3(eco.net,50000,25000)} note="$50K minimum" />
                                <Ratio label="ROI on cash" value={`${eco.roi.toFixed(0)}%`} status={stat3(eco.roi,40,20)} note="target 40%+" />
                                <Ratio label="Annualized ROI" value={`${eco.annRoi.toFixed(0)}%`} status={stat3(eco.annRoi,80,30)} note="capital velocity" />
                            </div>
                        </div>
                    </div>}

                    <div id="an-scenarios" className="scroll-mt-24">
                        <div className="mb-3">{sectionHeader(view==='flip'?'Scenarios — Fix and Flip':view==='rental'?'Scenarios — Rental / BRRRR':'Scenarios — Wholesale',view)}</div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">{(scenarios[view]||[]).map(renderCard)}</div>
                    </div>

                    {view==='flip'&&<div id="an-risk" className="scroll-mt-24"><details className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] group"><summary className="cursor-pointer select-none p-5 headline text-white flex items-center gap-2 list-none"><Activity className="w-4 h-4 text-amber-400" /> Risk analysis — sensitivity &amp; Monte Carlo<ChevronDown className="w-4 h-4 ml-auto text-slate-500 transition-transform group-open:rotate-180" /></summary><div className="px-5 pb-5 space-y-6">
                        <div><p className="text-xs text-slate-500 mb-3">Net profit as your riskiest inputs shift. Your current deal is the outlined cell.</p><div className="grid lg:grid-cols-2 gap-6">{renderGrid('ARV / Rehab',sens.arvD,sens.rehabD,sens.arvRehab,'Rehab',(d)=>`${d>0?'+':''}${(d*100).toFixed(0)}%`,(d)=>`${d>0?'+':''}${(d*100).toFixed(0)}%`)}{renderGrid('ARV / Hold',sens.arvD,sens.holdD,sens.arvHold,'Hold',(d)=>`${d>0?'+':''}${(d*100).toFixed(0)}%`,(d)=>`${d>0?'+':''}${d}mo`)}</div></div>
                        {mc&&<div><div className="flex items-center justify-between mb-1"><p className="headline text-white text-sm">Monte Carlo</p><span className="text-[10px] text-slate-600">{mc.N.toLocaleString()} runs</span></div><p className="text-xs text-slate-500 mb-3">Outcome spread when ARV, rehab, and hold time vary &mdash; rehab and time skewed toward overruns.</p><div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4"><div className={`rounded-lg p-3 ${mc.pProfit>=0.7?'kpi-good':mc.pProfit>=0.5?'kpi-warn':'kpi-bad'}`}><p className="text-[10px] uppercase tracking-wider text-slate-400">Chance of profit</p><p className="text-2xl font-extrabold accent-num text-white">{Math.round(mc.pProfit*100)}%</p></div>{mc.pTarget!=null&&<div className="bg-[#0F0F0F] rounded-lg p-3"><p className="text-[10px] uppercase tracking-wider text-slate-500">Hit target</p><p className="text-2xl font-extrabold accent-num text-white">{Math.round(mc.pTarget*100)}%</p></div>}<div className="bg-[#0F0F0F] rounded-lg p-3"><p className="text-[10px] uppercase tracking-wider text-slate-500">Downside P10</p><p className="text-lg font-extrabold accent-num text-white">{kfmt(mc.p10)}</p></div><div className="bg-[#0F0F0F] rounded-lg p-3"><p className="text-[10px] uppercase tracking-wider text-slate-500">Likely P50</p><p className="text-lg font-extrabold accent-num gradient-text">{kfmt(mc.p50)}</p></div><div className="bg-[#0F0F0F] rounded-lg p-3"><p className="text-[10px] uppercase tracking-wider text-slate-500">Upside P90</p><p className="text-lg font-extrabold accent-num text-white">{kfmt(mc.p90)}</p></div></div><div className="flex items-end gap-px h-24">{mc.hist.map((h,i)=>{const center=mc.min+(i+0.5)*mc.step;const mx=Math.max(...mc.hist,1);return <div key={i} title={kfmt(center)} className="flex-1 rounded-t" style={{height:`${Math.max((h/mx)*100,2)}%`,background:center>=0?'#10B981':'#EF4444',opacity:0.75}}></div>;})}</div><div className="flex justify-between text-[10px] text-slate-600 mt-1"><span>{kfmt(mc.min)}</span><span>net profit distribution</span><span>{kfmt(mc.max)}</span></div></div>}
                    </div></details></div>}
                </>)}

                <button onClick={()=>onChangeView&&onChangeView(View.FinancingProfit)} className="w-full fire-bg text-black font-extrabold uppercase tracking-wider py-4 rounded-lg headline hover:opacity-90 flex items-center justify-center gap-2 mt-2">Continue to Financing <ChevronDown className="w-5 h-5 -rotate-90" /></button>
            </div>
            <div className="lg:col-span-1"><div className="lg:sticky lg:top-4"><DealSnapshotRail /></div></div>
        </div>
    );
};

const FinancingProfit = ({onChangeView}) => {
    const {deal,updateDeal}=useDeal();
    const toast=useToast();
    const [sortBy,setSortBy]=useState('netProfit');
    const sqft=parseFloat(deal.sqft)||0;
    const arv=parseFloat(deal.arv)||0;
    const purchase=parseFloat(deal.purchasePrice)||0;
    const rehab=parseFloat(deal.finalEstimation)||parseFloat(deal.totalRehabCost)||computeRehabCost(deal).finalEstimation;
    const targetProfit=parseFloat(deal.targetProfit)||0;
    const metrics=useMemo(()=>getDealMetrics(arv,purchase,rehab,{ltv:parseFloat(deal.ltv)||0,interestRate:parseFloat(deal.interestRate)||0,holdingPeriod:parseFloat(deal.holdingPeriod)||0},sqft,deal.extraCosts||[],deal),[arv,purchase,rehab,deal.ltv,deal.interestRate,deal.holdingPeriod,sqft,deal.extraCosts,deal.computedDurationDays]);
    const strategy=deal.selectedStrategy||'flip';
    const fs=useMemo(()=>computeFinancingScenarios(deal,strategy),[deal,strategy]);
    const sorted=useMemo(()=>{const a=[...fs];const dir=(sortBy==='cashRequired'||sortBy==='risk'||sortBy==='timeToFirstDollar')?1:-1;return a.sort((x,y)=>{if(!x.available&&y.available)return 1;if(x.available&&!y.available)return -1;return dir*((y[sortBy]||0)-(x[sortBy]||0));});},[fs,sortBy]);
    const avail=fs.filter(s=>s.available);
    const bestProfit=avail.length>0?Math.max(...avail.map(s=>s.netProfit||0)):0;
    const lowestCash=avail.length>0?Math.min(...avail.map(s=>s.cashRequired||Infinity)):0;
    const highestLev=avail.length>0?Math.max(...avail.map(s=>s.loanAmount||0)):0;
    const highestRisk=avail.length>0?Math.max(...avail.map(s=>s.risk||0)):0;
    const selectFin=(id)=>{if(!fs.find(s=>s.id===id)?.available){toast?.show('Scenario unavailable');return;}updateDeal({selectedFinancingScenario:id});toast?.show(`Selected scenario`);};
    const selFin=fs.find(s=>s.id===deal.selectedFinancingScenario)||fs[0];
    const addExtra=()=>updateDeal(p=>({...p,extraCosts:[...(p.extraCosts||[]),{id:Date.now(),name:'',amount:''}]}));
    const updExtra=(id,f,v)=>updateDeal(p=>({...p,extraCosts:(p.extraCosts||[]).map(c=>c.id===id?{...c,[f]:v}:c)}));
    const rmExtra=(id)=>updateDeal(p=>({...p,extraCosts:(p.extraCosts||[]).filter(c=>c.id!==id)}));
    let npc='kpi-bad';
    if(targetProfit>0){if(metrics.netProfit>=targetProfit)npc='kpi-good';else if(metrics.netProfit>=targetProfit*0.9)npc='kpi-warn';}else if(metrics.netProfit>0)npc='kpi-good';
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A]">
                    <h2 className="text-xl font-bold headline gradient-text mb-4 flex items-center gap-2"><DollarSign className="w-5 h-5" /> Profit Analysis</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><div className="flex items-center justify-between mb-1"><label className="text-xs uppercase text-slate-400">ARV</label><input type="number" value={arv} onChange={(e)=>updateDeal({arv:e.target.value})} className="w-32 px-2 py-1 text-xs rounded text-right" /></div><input type="range" min="0" max="2000000" step="5000" value={arv} onChange={(e)=>updateDeal({arv:e.target.value})} /><p className="text-xs text-slate-500 mt-1">{formatCurrencySimple(arv)}{sqft>0?` (${formatCurrency(arv/sqft, true)}/sqft)`:''}</p></div>
                        <div><div className="flex items-center justify-between mb-1"><label className="text-xs uppercase text-slate-400">Purchase</label><input type="number" value={purchase} onChange={(e)=>updateDeal({purchasePrice:e.target.value})} className="w-32 px-2 py-1 text-xs rounded text-right" /></div><input type="range" min="0" max="2000000" step="5000" value={purchase} onChange={(e)=>updateDeal({purchasePrice:e.target.value})} /><p className="text-xs text-slate-500 mt-1">{formatCurrencySimple(purchase)}{sqft>0?` (${formatCurrency(purchase/sqft, true)}/sqft)`:''}</p></div>
                        <div><label className="text-xs uppercase text-slate-400">Target Profit</label><input type="number" value={deal.targetProfit} onChange={(e)=>updateDeal({targetProfit:e.target.value})} className="w-full px-3 py-2 rounded mt-1" /></div>
                        <div><label className="text-xs uppercase text-slate-400">LTV %</label><input type="number" value={deal.ltv} onChange={(e)=>updateDeal({ltv:e.target.value})} className="w-full px-3 py-2 rounded mt-1" /></div>
                        <div><label className="text-xs uppercase text-slate-400">Interest Rate %</label><input type="number" step="0.1" value={deal.interestRate} onChange={(e)=>updateDeal({interestRate:e.target.value})} className="w-full px-3 py-2 rounded mt-1" /></div>
                        <div><label className="text-xs uppercase text-slate-400">Total Hold Period</label><div className="w-full px-3 py-2 rounded mt-1 bg-[#0F0F0F] border border-[#333] text-amber-400 font-bold accent-num">{metrics.holdingMonths?metrics.holdingMonths.toFixed(1):'-'} months</div><p className="text-xs text-slate-500 mt-1">Rehab {getProjectMonths(deal).rehabMonths.toFixed(1)}mo + 2mo closing/sale buffer (min 4mo)</p></div>
                    </div>
                    <div className="mt-4"><p className="text-xs uppercase text-slate-400 mb-2">Extra Costs</p>{(deal.extraCosts||[]).map(c=>(<div key={c.id} className="flex gap-2 mb-2"><input type="text" placeholder="Name" value={c.name} onChange={(e)=>updExtra(c.id,'name',e.target.value)} className="flex-1 px-2 py-1 rounded text-sm" /><input type="number" placeholder="$" value={c.amount} onChange={(e)=>updExtra(c.id,'amount',e.target.value)} className="w-32 px-2 py-1 rounded text-sm" /><button onClick={()=>rmExtra(c.id)} className="px-2 text-red-400"><X className="w-4 h-4" /></button></div>))}<button onClick={addExtra} className="text-xs px-3 py-1 bg-[#0F0F0F] hover:bg-[#222] rounded">+ Add Extra Cost</button></div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                        <div className={`p-4 rounded ${npc}`}><p className="text-xs uppercase text-slate-400">Net Profit</p><p className="text-2xl font-bold accent-num">{formatCurrencySimple(metrics.netProfit)}</p></div>
                        <div className={`p-4 rounded ${metrics.roi>=25?'kpi-good':(metrics.roi>=10?'kpi-warn':'kpi-bad')}`}><p className="text-xs uppercase text-slate-400">ROI</p><p className="text-2xl font-bold accent-num">{formatPct(metrics.roi)}</p></div>
                        <div className={`p-4 rounded ${metrics.profitMargin>=20?'kpi-good':(metrics.profitMargin>=10?'kpi-warn':'kpi-bad')}`}><p className="text-xs uppercase text-slate-400">Margin</p><p className="text-2xl font-bold accent-num">{formatPct(metrics.profitMargin)}</p></div>
                    </div>
                </div>
                <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A]">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2"><h2 className="text-xl font-bold headline gradient-text flex items-center gap-2"><Layers className="w-5 h-5" /> Financing Scenarios <span className="text-sm text-slate-400 capitalize font-normal">({strategy})</span></h2><select value={sortBy} onChange={(e)=>setSortBy(e.target.value)} className="text-xs px-2 py-1 rounded"><option value="netProfit">Best Profit</option><option value="cashRequired">Lowest Cash</option><option value="risk">Lowest Risk</option><option value="annualizedROI">Best Annualized ROI</option><option value="timeToFirstDollar">Fastest Cash Back</option></select></div>
                    {arv===0||purchase===0?(<div className="border border-dashed border-amber-500/40 rounded-lg p-4 text-center"><p className="text-xs text-amber-300">Financing scenarios calculate from ARV and Purchase. Enter them above or on the Strategy tab.</p></div>):(<div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr className="text-slate-500 uppercase"><th className="text-left py-2 px-2">Scenario</th><th className="px-2">Cash Req</th><th className="px-2">Loan</th><th className="px-2">Mo Carry</th><th className="px-2">Net Profit</th><th className="px-2">CoC</th><th className="px-2">Ann ROI</th><th className="px-2">TTFD</th><th className="px-2">Risk</th></tr></thead><tbody>{sorted.map(s=>{const sel=deal.selectedFinancingScenario===s.id;const bp=s.netProfit===bestProfit&&s.available;const lc=s.cashRequired===lowestCash&&s.available;const hl=s.loanAmount===highestLev&&s.available;const hr=s.risk===highestRisk&&s.available;return (<tr key={s.id} onClick={()=>selectFin(s.id)} className={`border-t border-[#2A2A2A] cursor-pointer hover:bg-[#0F0F0F] ${sel?'bg-amber-500/10':''} ${!s.available?'opacity-40':''}`}><td className="py-2 px-2 text-white font-semibold">{s.name}{!s.available&&<span className="block text-xs text-slate-500 italic">{s.unavailableReason}</span>}</td><td className={`py-2 px-2 accent-num text-center ${lc?'text-blue-400 font-bold':'text-white'}`}>{s.available?formatCurrencySimple(s.cashRequired):'—'}</td><td className={`py-2 px-2 accent-num text-center ${hl?'text-amber-400 font-bold':'text-white'}`}>{s.available?formatCurrencySimple(s.loanAmount):'—'}</td><td className="py-2 px-2 accent-num text-center text-white">{s.available?formatCurrencySimple(s.monthlyCarry):'—'}</td><td className={`py-2 px-2 accent-num text-center ${bp?'text-emerald-400 font-bold':'text-white'}`}>{s.available?formatCurrencySimple(s.netProfit):'—'}</td><td className="py-2 px-2 accent-num text-center text-white">{s.available?formatPct(s.coc,0):'—'}</td><td className="py-2 px-2 accent-num text-center text-white">{s.available?formatPct(s.annualizedROI,0):'—'}</td><td className="py-2 px-2 accent-num text-center text-white">{s.available?(s.timeToFirstDollar||0).toFixed(1)+'mo':'—'}</td><td className={`py-2 px-2 accent-num text-center ${hr?'text-red-400 font-bold':'text-white'}`}>{s.available?(s.risk||0).toFixed(1)+'/5':'—'}</td></tr>);})}</tbody></table></div>)}
                </div>
                {arv>0&&purchase>0&&selFin&&selFin.available&&(<div className="bg-[#1A1A1A] p-6 rounded-xl border-2 border-amber-500/40"><h3 className="font-bold headline gradient-text mb-3">{selFin.name} (Selected)</h3><div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm"><div><p className="text-xs text-slate-500">Acquisition Cost</p><p className="accent-num text-white">{formatCurrencySimple(selFin.acquisitionCost)}</p></div><div><p className="text-xs text-slate-500">Total Project Cost</p><p className="accent-num text-white">{formatCurrencySimple(selFin.totalProjectCost)}</p></div><div><p className="text-xs text-slate-500">Total Financing Cost</p><p className="accent-num text-white">{formatCurrencySimple(selFin.totalFinancingCost)}</p></div><div><p className="text-xs text-slate-500">Time to First Dollar</p><p className="accent-num text-white">{(selFin.timeToFirstDollar||0).toFixed(1)} mo</p></div></div></div>)}
                <button onClick={()=>onChangeView&&onChangeView(View.DealScore)} className="w-full fire-bg text-black font-extrabold uppercase tracking-wider py-4 rounded-lg headline hover:opacity-90 flex items-center justify-center gap-2 mt-2">Continue to Deal Score <ChevronDown className="w-5 h-5 -rotate-90" /></button>
            </div>
            <div className="lg:col-span-1"><div className="lg:sticky lg:top-4"><DealSnapshotRail /></div></div>
        </div>
    );
};

const DealScore = () => {
    const {deal}=useDeal();
    const score=useMemo(()=>computeDealScore(deal),[deal]);
    const animScore=useCountUp(score.total,800);
    const [expMetric,setExpMetric]=useState(null);
    const arv=parseFloat(deal.arv)||0;
    const purchase=parseFloat(deal.purchasePrice)||0;
    const rehab=parseFloat(deal.finalEstimation)||parseFloat(deal.totalRehabCost)||0;
    const ready=arv>0&&purchase>0&&rehab>0;
    const VerdictIcon=score.verdict==='BUY'?Trophy:(score.verdict==='WAIT'?Clock:X);
    const vg=score.verdict==='BUY'?'linear-gradient(to right, #FFD700, #FFA500, #FF4500)':score.verdict==='WAIT'?'linear-gradient(to right, #FFD700, #FFA500)':'linear-gradient(to right, #DC2626, #991B1B)';
    const metroBM=METRO_BENCHMARKS[deal.metroDisplay]||NATIONAL_BENCHMARKS;
    const metroFlipROI=metroBM.flipROI||25.5;
    const crVal=score.metrics.find(m=>m.id===2);
    const computedROI=crVal?parseFloat((crVal.value||'0').replace('%','')):0;
    const roiDelta=Math.abs(computedROI-metroFlipROI);
    const showGeoWarn=roiDelta>30&&deal.metroDisplay;
    const mColor=(m)=>{const p=m.score/m.max;if(p>=0.75)return 'kpi-good';if(p>=0.40)return 'kpi-warn';return 'kpi-bad';};
    const catW={Financial:35,Market:15,Capital:15,Execution:15,Strategy:15,Safety:5};
    if(!ready){
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#1A1A1A] border border-dashed border-amber-500/40 rounded-xl p-12 text-center">
                        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold headline gradient-text mb-3">Build a Deal First</h2>
                        <p className="text-sm text-slate-300 max-w-md mx-auto">The Deal Score evaluates 20 weighted metrics. To run the math, you need:</p>
                        <ul className="text-sm text-slate-400 mt-4 space-y-1 inline-block text-left">
                            <li className={arv>0?'text-emerald-400':''}>{arv>0?'✓':'○'} ARV entered (Strategy tab)</li>
                            <li className={purchase>0?'text-emerald-400':''}>{purchase>0?'✓':'○'} Purchase Price entered (Strategy tab)</li>
                            <li className={rehab>0?'text-emerald-400':''}>{rehab>0?'✓':'○'} Rehab scope built (Rehab tab)</li>
                        </ul>
                    </div>
                </div>
                <div className="lg:col-span-1"><div className="lg:sticky lg:top-4"><DealSnapshotRail /></div></div>
            </div>
        );
    }
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div className="rounded-xl p-8 text-center" style={{backgroundImage:vg}}><VerdictIcon className="w-16 h-16 mx-auto text-black mb-2" /><p className="text-sm uppercase tracking-wider text-black/70 font-bold">Verdict</p><p className="text-7xl font-extrabold text-black headline">{score.verdict}</p><p className="text-2xl font-bold text-black mt-2">Grade {score.grade} / {animScore.toFixed(1)} / 100</p></div>
                {showGeoWarn&&(<div className="bg-yellow-500/10 border border-yellow-500/40 rounded-xl p-4 flex items-start gap-3"><AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" /><p className="text-sm text-yellow-100">Your projected ROI ({computedROI.toFixed(1)}%) is far from the {deal.metroDisplay.split(',')[0]} median ({metroFlipROI.toFixed(1)}%). Verify assumptions.</p></div>)}
                {(()=>{const weak=[...score.metrics].sort((a,b)=>(a.score/a.max)-(b.score/b.max)).slice(0,3);return weak.some(w=>w.score<w.max)?(<div className="bg-red-500/5 border border-red-500/30 rounded-xl p-4"><p className="text-xs uppercase tracking-wider text-red-300 font-bold mb-2">Focus Areas — Weakest Metrics</p><div className="space-y-2">{weak.map(w=>(<div key={w.id} className="flex items-center justify-between"><span className="text-sm text-white">{w.name}</span><span className="text-sm accent-num text-red-300 font-bold">{w.score}/{w.max}</span></div>))}</div></div>):null;})()}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{Object.entries(score.categoryTotals).map(([c,t])=>(<div key={c} className="bg-[#1A1A1A] rounded-xl p-4 border border-[#2A2A2A] text-center"><p className="text-xs uppercase text-slate-400">{c}</p><p className="text-2xl font-bold accent-num gradient-text">{t.toFixed(1)}<span className="text-sm text-slate-500">/{catW[c]}</span></p></div>))}</div>
                <div><h3 className="text-lg font-bold headline mb-3">20 Metric Breakdown</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{score.metrics.map(m=>(<button key={m.id} onClick={()=>setExpMetric(expMetric===m.id?null:m.id)} className={`text-left rounded-lg p-4 border border-[#2A2A2A] hover:bg-[#0F0F0F] ${mColor(m)}`}><div className="flex items-center justify-between"><p className="font-bold text-white text-sm">{m.id}. {m.name}</p><p className="accent-num text-amber-400 text-sm font-bold">{m.score} / {m.max}</p></div><p className="text-xs text-slate-300 mt-1 accent-num">{m.value}</p>{expMetric===m.id&&<p className="text-xs text-slate-400 mt-2 italic">{m.why}</p>}</button>))}</div></div>
            </div>
            <div className="lg:col-span-1"><div className="lg:sticky lg:top-4"><DealSnapshotRail /></div></div>
        </div>
    );
};

const useTabCompletion=(deal)=>{const hasScope=Object.keys(deal.selectedItems||{}).some(k=>deal.selectedItems[k]);const hasNumbers=(parseFloat(deal.arv)||0)>0&&(parseFloat(deal.purchasePrice)||0)>0;const ready=hasScope&&hasNumbers;return {[View.RehabEstimator]:hasScope,[View.StrategyAnalyzer]:ready,[View.FinancingProfit]:ready,[View.DealScore]:ready};};

const Header = ({currentView,onChangeView,onOpenPipeline}) => {
    const {deal}=useDeal();
    const {deals}=useSavedDealsContext();
    const completion=useTabCompletion(deal);
    const toast=useToast();
    const tabs=[{id:View.Home,label:'Home',Icon:Home},{id:View.RehabEstimator,label:'Rehab',Icon:Construction},{id:View.StrategyAnalyzer,label:'Analysis',Icon:Compass},{id:View.FinancingProfit,label:'Financing',Icon:DollarSign},{id:View.DealScore,label:'Score',Icon:Award}];
    const handleShare=async()=>{const url=`${window.location.origin}${window.location.pathname}?deal=${encodeDealToUrl(deal)}`;try{await navigator.clipboard.writeText(url);toast?.show('Share URL copied');}catch(e){window.prompt('Copy this URL:',url);}};
    return (
        <nav className="bg-[#0F0F0F] border-b border-[#2A2A2A] sticky top-0 z-30 no-print">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                <button onClick={()=>onChangeView(View.Home)} className="flex items-center gap-2 flex-shrink-0 hover:opacity-80">
                    <img src="https://storage.googleapis.com/msgsndr/zQh0YM3EIsWgcjMDTSSC/media/68c95d8f7505d3a75a7fabd2.png" alt="Unshakable Investor" className="h-8 w-auto" />
                    <span className="font-extrabold headline text-lg gradient-text hidden md:inline">Essential Analyzer</span>
                </button>
                <div className="hidden lg:flex items-center gap-1">{tabs.map(t=>(<button key={t.id} onClick={()=>onChangeView(t.id)} className={`nav-button flex items-center gap-2 px-3 py-2 rounded text-sm font-semibold relative ${currentView===t.id?'active':'text-slate-300 hover:bg-[#1A1A1A]'}`}><t.Icon className="w-4 h-4" /> {t.label}{completion[t.id]&&currentView!==t.id&&<span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5"></span>}</button>))}</div>
                <div className="flex items-center gap-2">
                    <button onClick={onOpenPipeline} className="icon-btn p-2.5 rounded hover:bg-[#1A1A1A] relative" aria-label="Your profile and saved deals">
                        <User className="w-6 h-6 text-amber-400" />
                        {deals.length>0&&<span className="absolute -top-1 -right-1 bg-amber-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center accent-num">{deals.length}</span>}
                    </button>
                    <button onClick={handleShare} className="icon-btn p-2.5 rounded hover:bg-[#1A1A1A]" aria-label="Share"><Share2 className="w-6 h-6 text-amber-400" /></button>
                    <button onClick={()=>supabase.auth.signOut()} className="icon-btn p-2.5 rounded hover:bg-[#1A1A1A]" aria-label="Sign out"><LogOut className="w-6 h-6 text-slate-400" /></button>
                </div>
            </div>
        </nav>
    );
};

const MobileBottomTabBar = ({currentView,onChangeView}) => {
    const {deal}=useDeal();
    const completion=useTabCompletion(deal);
    const tabs=[{id:View.Home,label:'Home',Icon:Home},{id:View.RehabEstimator,label:'Rehab',Icon:Construction},{id:View.StrategyAnalyzer,label:'Analysis',Icon:Compass},{id:View.FinancingProfit,label:'Finance',Icon:DollarSign},{id:View.DealScore,label:'Score',Icon:Award}];
    return (<div className="mobile-tab-bar no-print lg:hidden">{tabs.map(t=>(<button key={t.id} onClick={()=>onChangeView(t.id)} className={`flex flex-col items-center justify-center px-1 py-1 rounded text-[11px] relative ${currentView===t.id?'text-amber-400':'text-slate-400'}`}><t.Icon className="w-5 h-5 mb-0.5" /><span>{t.label}</span>{completion[t.id]&&currentView!==t.id&&<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-0 right-0"></span>}</button>))}</div>);
};

const AppShell = ({currentView,onChangeView}) => {
    const printDate=new Date().toLocaleDateString();
    return (
        <main className="max-w-7xl mx-auto px-4 py-6 pb-24 lg:pb-6">
            <div className="print-only mb-4 pb-3 border-b-2 border-orange-500"><h1 className="text-2xl font-extrabold text-orange-600">UNSHAKABLE Deal Analyzer</h1><p className="text-sm">Generated {printDate}</p></div>
            <div style={{display:currentView===View.Home?'block':'none'}}><HomePage onChangeView={onChangeView} /></div>
            <div style={{display:currentView===View.RehabEstimator?'block':'none'}}><RehabEstimator onChangeView={onChangeView} /></div>
            <div style={{display:currentView===View.StrategyAnalyzer?'block':'none'}}><StrategyAnalyzer onChangeView={onChangeView} /></div>
            <div style={{display:currentView===View.FinancingProfit?'block':'none'}}><FinancingProfit onChangeView={onChangeView} /></div>
            <div style={{display:currentView===View.DealScore?'block':'none'}}><DealScore /></div>
            <div className="print-only mt-6 pt-3 border-t border-slate-300 text-xs text-center"><p>The Unshakable Investor, Fix and Flip Deal Analyzer v4.1</p></div>
        </main>
    );
};

const AppInner = ({currentView,setCurrentView,pipelineOpen,setPipelineOpen}) => {
    const {deal,updateDeal,replaceDeal}=useDeal();
    const {settings}=useSettings();
    const applySettings=(d)=>settings?{...d,userCashAvailable:settings.cash_available!=null?String(settings.cash_available):'',creditTier:settings.credit_tier||'1-3deals',targetAssignmentFee:settings.target_assignment_fee!=null?String(settings.target_assignment_fee):''}:d;
    useEffect(()=>{if(settings){updateDeal({userCashAvailable:settings.cash_available!=null?String(settings.cash_available):'',creditTier:settings.credit_tier||'1-3deals',targetAssignmentFee:settings.target_assignment_fee!=null?String(settings.target_assignment_fee):''});}},[settings]);
    const autoSchedule=useMemo(()=>computeGanttSchedule(deal),[deal]);
    useEffect(()=>{let td=autoSchedule.totalDays;if(deal.selectedStrategy==='rental')td+=14;const nm=Math.max(Math.ceil(td/30),1);if(td!==deal.computedDurationDays){updateDeal({computedDurationDays:td,holdingPeriod:String(nm)});}},[autoSchedule.totalDays,deal.selectedStrategy]);
    const toast=useToast();
    const handleLoadDeal=(ld)=>{replaceDeal(applySettings(ld));setPipelineOpen(false);setCurrentView(View.RehabEstimator);toast?.show(`Loaded: ${ld.name||'deal'}`);};
    useEffect(()=>{const h=(e)=>handleLoadDeal(e.detail);window.addEventListener('loadDeal',h);return ()=>window.removeEventListener('loadDeal',h);},[]);
    return (<><Header currentView={currentView} onChangeView={setCurrentView} onOpenPipeline={()=>setPipelineOpen(true)} /><AppShell currentView={currentView} onChangeView={setCurrentView} /><MobileBottomTabBar currentView={currentView} onChangeView={setCurrentView} /><PipelineDrawer open={pipelineOpen} onClose={()=>setPipelineOpen(false)} onLoadDeal={handleLoadDeal} /></>);
};

const LOGO_URL='https://storage.googleapis.com/msgsndr/zQh0YM3EIsWgcjMDTSSC/media/68c95d8f7505d3a75a7fabd2.png';

const BrandLoader = ({label='Preparing your deal analyzer'}) => (
    <div className="min-h-dvh home-hero flex flex-col items-center justify-center gap-6 px-4">
        <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="eo-ring absolute inset-0 rounded-full"></div>
            <img src={LOGO_URL} alt="" className="w-9 h-9 object-contain" style={{animation:'eo_pulse 1.8s ease-in-out infinite'}} />
        </div>
        <div className="text-center">
            <p className="headline gradient-text font-extrabold text-lg tracking-tight">EssentialOS</p>
            <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500 mt-1.5">{label}</p>
            <div className="mt-4 mx-auto w-40 h-[3px] rounded-full bg-[#161616] overflow-hidden relative">
                <span className="absolute inset-y-0 left-0 w-2/5 fire-bg rounded-full" style={{animation:'eo_shimmer 1.15s ease-in-out infinite'}}></span>
            </div>
        </div>
    </div>
);

const LoginScreen = () => {
    const [mode,setMode]=useState('signin');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [busy,setBusy]=useState(false);
    const [err,setErr]=useState('');
    const [msg,setMsg]=useState('');
    const submit=async(e)=>{e.preventDefault();setErr('');setMsg('');setBusy(true);try{if(mode==='signin'){const {error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;}else{const {error}=await supabase.auth.signUp({email,password});if(error)throw error;setMsg('Account created. If confirmation is required, check your email, then sign in.');setMode('signin');}}catch(e){setErr(e.message||'Something went wrong');}finally{setBusy(false);}};
    const features=[
        {Icon:Construction,t:'62-item rehab estimator',d:'Metro-adjusted to your market'},
        {Icon:Compass,t:'9 exit scenarios',d:'Wholesale, rental, or flip'},
        {Icon:DollarSign,t:'5 financing stacks',d:'Compared side by side'},
        {Icon:Award,t:'20-metric deal score',d:'A clear buy, wait, or kill'}
    ];
    return (
        <div className="min-h-dvh home-hero flex items-center justify-center px-5 py-10">
            <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center">
                <div className="hidden lg:flex flex-col eo-stagger">
                    <div className="flex items-center gap-3 mb-9"><img src={LOGO_URL} alt="Unshakable Investor" className="h-9 w-auto" /><span className="headline gradient-text font-extrabold text-xl tracking-tight">UNSHAKABLE</span></div>
                    <h1 className="headline text-white font-extrabold text-4xl xl:text-5xl leading-[1.08]">Underwrite a flip<br /><span className="gradient-text">before you sign.</span></h1>
                    <p className="text-slate-400 mt-5 max-w-md leading-relaxed">EssentialOS runs every assumption through four layers of math, then scores the deal so you know whether to buy, wait, or kill — in minutes.</p>
                    <div className="mt-9 space-y-3.5 max-w-md">
                        {features.map(f=>(<div key={f.t} className="flex items-start gap-3"><div className="w-9 h-9 rounded-lg bg-[#161616] border border-[#262626] flex items-center justify-center flex-shrink-0"><f.Icon className="w-4 h-4 text-amber-400" /></div><div><p className="text-white text-sm font-semibold leading-tight">{f.t}</p><p className="text-slate-500 text-xs mt-0.5">{f.d}</p></div></div>))}
                    </div>
                </div>
                <div className="w-full max-w-md mx-auto lg:mx-0 eo-stagger">
                    <div className="lg:hidden flex items-center justify-center gap-2.5 mb-7"><img src={LOGO_URL} alt="Unshakable Investor" className="h-9 w-auto" /><span className="headline gradient-text font-extrabold text-lg tracking-tight">EssentialOS</span></div>
                    <form onSubmit={submit} className="bg-[#141414] border border-[#262626] rounded-2xl p-7 shadow-2xl">
                        <h2 className="headline text-white font-extrabold text-2xl tracking-tight">{mode==='signin'?'Welcome back':'Create your account'}</h2>
                        <p className="text-slate-500 text-sm mt-1.5 mb-6">{mode==='signin'?'Sign in to your deal pipeline.':'Start saving and scoring deals.'}</p>
                        <div className="space-y-4">
                            <div><label className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Email</label><div className="relative mt-1.5"><Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" /><input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@email.com" className="w-full pl-10 pr-3 py-3 text-sm" /></div></div>
                            <div><label className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Password</label><div className="relative mt-1.5"><Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" /><input type="password" required minLength={6} value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-3 py-3 text-sm" /></div></div>
                        </div>
                        {err&&<p className="text-xs text-red-400 mt-3 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />{err}</p>}
                        {msg&&<p className="text-xs text-emerald-400 mt-3">{msg}</p>}
                        <button type="submit" disabled={busy} className="w-full fire-bg text-black font-extrabold uppercase tracking-wider py-3.5 rounded-lg headline hover:opacity-90 disabled:opacity-60 transition-opacity mt-5 flex items-center justify-center gap-2">{busy?(<><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full" style={{animation:'eo_spin .7s linear infinite'}}></span>Please wait</>):(mode==='signin'?'Sign in':'Create account')}</button>
                        <p className="text-xs text-slate-500 text-center mt-5">{mode==='signin'?'Need access?':'Already have access?'} <button type="button" onClick={()=>{setErr('');setMsg('');setMode(mode==='signin'?'signup':'signin');}} className="text-amber-400 hover:underline font-semibold">{mode==='signin'?'Create account':'Sign in'}</button></p>
                    </form>
                    <p className="text-center text-xs text-slate-600 mt-5">Your saved deals sync securely to your account.</p>
                </div>
            </div>
        </div>
    );
};

const AuthedApp = () => {
    const [currentView,setCurrentView]=useState(View.Home);
    const [pipelineOpen,setPipelineOpen]=useState(false);
    return (<DealProvider><SettingsProvider><SavedDealsProvider><AppInner currentView={currentView} setCurrentView={setCurrentView} pipelineOpen={pipelineOpen} setPipelineOpen={setPipelineOpen} /></SavedDealsProvider></SettingsProvider></DealProvider>);
};

const AuthGate = () => {
    const [session,setSession]=useState(undefined);
    useEffect(()=>{supabase.auth.getSession().then(({data})=>setSession(data.session));const {data:sub}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s));return ()=>sub.subscription.unsubscribe();},[]);
    if(session===undefined)return <BrandLoader />;
    if(!session)return <LoginScreen />;
    return <AuthedApp />;
};

const App = () => (<ToastProvider><AuthGate /></ToastProvider>);

export default App;
