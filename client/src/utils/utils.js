import React, { useEffect } from 'react';

export const capitalize = (s) => {
	return s[0].toUpperCase() + s.slice(1);
};

export const truncate = (str, n) => {
	return str.length > n ? str.substr(0, n - 1) + '...' : str;
};

export const numberWithCommas = (x) => {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const lengthChecker = (array) => {
	return array.length > 99 ? '99+' : array.length;
};

// bsr / category % calculator
export const calculateBSR = (currentRank, category) => {
	let totalItems;
	if (category === 'Appliances') {
		totalItems = 616462;
	} else if (category.includes('Arts')) {
		totalItems = 7498354;
	} else if (category === 'Automotive') {
		totalItems = 22271330;
	} else if (category.includes('Baby')) {
		totalItems = 2969134;
	} else if (category.includes('Beauty')) {
		totalItems = 8918802;
	} else if (category === 'Books') {
		totalItems = 63513871;
	} else if (category.includes('CDs')) {
		totalItems = 5768853;
	} else if (category.includes('Clothing')) {
		totalItems = 115990329;
	} else if (category.includes('Collectibles')) {
		totalItems = 5319325;
	} else if (category.includes('Electronics')) {
		totalItems = 13436282;
	} else if (category.includes('Grocery')) {
		totalItems = 2871202;
	} else if (category.includes('Handmade')) {
		totalItems = 1515790;
	} else if (category.includes('Health')) {
		totalItems = 7528676;
	} else if (category.includes('Home')) {
		totalItems = 59108947;
	} else if (category.includes('Industrial')) {
		totalItems = 9915828;
	} else if (category.includes('Dining')) {
		totalItems = 59108947;
	} else if (category.includes('Movies')) {
		totalItems = 3426934;
	} else if (category.includes('Musical')) {
		totalItems = 1455860;
	} else if (category.includes('Office')) {
		totalItems = 7746679;
	} else if (category.includes('Patio')) {
		totalItems = 8107431;
	} else if (category.includes('Pet')) {
		totalItems = 4996454;
	} else if (category.includes('Software')) {
		totalItems = 160164;
	} else if (category.includes('Sports')) {
		totalItems = 29519885;
	} else if (category.includes('Tools')) {
		totalItems = 17564272;
	} else if (category.includes('Toys')) {
		totalItems = 8933993;
	} else if (category === 'Video Games') {
		totalItems = 730691;
	}
	let bsrPercentage = ((currentRank / totalItems) * 100).toFixed(3);
	return bsrPercentage;
};

function setLeadTitle(currentTitle) {
	let newTitle;
	if (currentTitle === '1000bulbs.com') {
		newTitle = '1000 Bulbs';
	} else if (currentTitle === '1sale.com') {
		newTitle = '1 Sale';
	} else if (currentTitle === '511tactical.com') {
		newTitle = '511 Tactical';
	} else if (currentTitle === '6pm.com') {
		newTitle = '6 PM';
	} else if (currentTitle === 'abebooks.com') {
		newTitle = 'Abe Books';
	} else if (currentTitle === 'abesofmaine.com') {
		newTitle = 'Abes of Maine';
	} else if (currentTitle === 'absinthes.com') {
		newTitle = 'Absinthes';
	} else if (currentTitle === 'absinthes.com') {
		newTitle = 'Academy';
	} else if (currentTitle === 'accessorygeeks.com') {
		newTitle = 'Accessory Geeks';
	} else if (currentTitle === 'acehardware.com') {
		newTitle = 'Ace Hardware';
	} else if (currentTitle === 'acurite.com') {
		newTitle = 'Acurite';
	} else if (currentTitle === 'adagio.com') {
		newTitle = 'Adagio';
	} else if (currentTitle === 'advanceautoparts.com') {
		newTitle = 'Advance Auto Parts';
	} else if (currentTitle === 'ae.com') {
		newTitle = 'American Eagle';
	} else if (currentTitle === 'aerosoles.com') {
		newTitle = 'Aerosoles';
	} else if (currentTitle === 'ahava.com') {
		newTitle = 'Ahava';
	} else if (currentTitle === 'airgundepot.com') {
		newTitle = 'Air Gun Depot';
	} else if (currentTitle === 'ajmadison.com') {
		newTitle = 'AJ Madison';
	} else if (currentTitle === 'albeebaby.com') {
		newTitle = 'Albee Baby';
	} else if (currentTitle === 'allegromedical.com') {
		newTitle = 'Allegro Medical';
	} else if (currentTitle === 'allenedmonds.com') {
		newTitle = 'Allen Edmonds';
	} else if (currentTitle === 'allposters.com') {
		newTitle = 'All Posters';
	} else if (currentTitle === 'allstarhealth.com') {
		newTitle = 'All Star Health';
	} else if (currentTitle === 'amazon.com') {
		newTitle = 'Amazon';
	} else if (currentTitle === 'americanapparel.com') {
		newTitle = 'American Apparel';
	} else if (currentTitle === 'americasbest.com') {
		newTitle = "America's Best";
	} else if (currentTitle === 'amiclubwear.com') {
		newTitle = 'AMI Clubwear';
	} else if (currentTitle === 'amsterdamprinting.com') {
		newTitle = 'Amsterdam Printing';
	} else if (currentTitle === 'andrewmarc.com') {
		newTitle = 'Andrew Marc';
	} else if (currentTitle === 'anntaylor.com') {
		newTitle = 'Ann Taylor';
	} else if (currentTitle === 'appliancepartspros.com') {
		newTitle = 'Appliance Part Pros';
	} else if (currentTitle === 'artsupplywarehouse.com') {
		newTitle = 'Art Supply Warehouse';
	} else if (currentTitle === 'ashford.com') {
		newTitle = 'Ashford';
	} else if (currentTitle === 'backcountry.com') {
		newTitle = 'Backcountry';
	} else if (currentTitle === 'banggood.com') {
		newTitle = 'Bang Good';
	} else if (currentTitle === 'bareminerals.com') {
		newTitle = 'Bare Minerals';
	} else if (currentTitle === 'barnesandnoble.com') {
		newTitle = 'Barnes and Noble';
	} else if (currentTitle === 'baseballmonkey.com') {
		newTitle = 'Baseball Monkey';
	} else if (currentTitle === 'baseballsavings.com') {
		newTitle = 'Baseball Savings';
	} else if (currentTitle === 'bathandbodyworks.com') {
		newTitle = 'Bath and Body Works';
	} else if (currentTitle === 'bbtoystore.com') {
		newTitle = 'BB Toy Store';
	} else if (currentTitle === 'beallsflorida.com') {
		newTitle = "Beall's Florida";
	} else if (currentTitle === 'beautybrands.com') {
		newTitle = 'Beauty Brands';
	} else if (currentTitle === 'beautyencounter.com') {
		newTitle = 'Beauty Encounter';
	} else if (currentTitle === 'beautyexpert.com') {
		newTitle = 'Beauty Expert';
	} else if (currentTitle === 'beautylish.com') {
		newTitle = 'Beautylish';
	} else if (currentTitle === 'bedbathandbeyond.com') {
		newTitle = 'Bed, Bath, and Beyond';
	} else if (currentTitle === 'belk.com') {
		newTitle = 'Belk';
	} else if (currentTitle === 'belkin.com') {
		newTitle = 'Belkin';
	} else if (currentTitle === 'bergners.com') {
		newTitle = "Bergner's";
	} else if (currentTitle === 'bestbuy.com') {
		newTitle = 'Best Buy';
	} else if (currentTitle === 'big5sportinggoods.com') {
		newTitle = 'Big 5 Sporting Goods';
	} else if (currentTitle === 'bigbadtoystore.com') {
		newTitle = 'Big Bad Toy Store';
	} else if (currentTitle === 'bigelowchemists.com') {
		newTitle = 'Bigelow Chemists';
	} else if (currentTitle === 'biglots.com') {
		newTitle = 'Big Lots';
	} else if (currentTitle === 'bitsandpieces.com') {
		newTitle = 'Bits and Pieces';
	} else if (currentTitle === 'bjs.com') {
		newTitle = "BJ's";
	} else if (currentTitle === 'bloomingdales.com') {
		newTitle = "Bloomingdale's";
	} else if (currentTitle === 'bodybuilding.com') {
		newTitle = 'Body Building';
	} else if (currentTitle === 'bonanza.com') {
		newTitle = 'Bonanza';
	} else if (currentTitle === 'bookpal.com') {
		newTitle = 'Book Pal';
	} else if (currentTitle === 'booksamillion.com') {
		newTitle = 'Books-a-Million';
	} else if (currentTitle === 'bornshoes.com') {
		newTitle = 'Born Shoes';
	} else if (currentTitle === 'boscovs.com') {
		newTitle = "Boscov's";
	} else if (currentTitle === 'buybuybaby.com') {
		newTitle = 'Buy Buy Baby';
	} else if (currentTitle === 'buycostumes.com') {
		newTitle = 'Buy Costumes';
	} else if (currentTitle === 'buydig.com') {
		newTitle = 'Buy Dig';
	} else if (currentTitle === 'c21stores.com') {
		newTitle = 'Century 21';
	} else if (currentTitle === 'cafebritt.com') {
		newTitle = 'Cafe Britt';
	} else if (currentTitle === 'calendars.com') {
		newTitle = 'Calendars';
	} else if (currentTitle === 'callawaygolf.com') {
		newTitle = 'Callaway Golf';
	} else if (currentTitle === 'campingworld.com') {
		newTitle = 'Camping World';
	} else if (currentTitle === 'campmor.com') {
		newTitle = 'Campmor';
	} else if (currentTitle === 'carealotpets.com') {
		newTitle = 'Care-a-Lot Pets';
	} else if (currentTitle === 'carolsdaughter.com') {
		newTitle = "Carol's Daughter";
	} else if (currentTitle === 'carolwrightgifts.com') {
		newTitle = 'Carol Wright Gifts';
	} else if (currentTitle === 'carters.com') {
		newTitle = "Carter's";
	} else if (currentTitle === 'cduniverse.com') {
		newTitle = 'CD Universe';
	} else if (currentTitle === 'chewy.com') {
		newTitle = 'Chewy';
	} else if (currentTitle === 'chiccousa.com') {
		newTitle = 'Chicco';
	} else if (currentTitle === 'chicos.com') {
		newTitle = "Chico's";
	} else if (currentTitle === 'chineselaundry.com') {
		newTitle = 'Chinese Laundry';
	} else if (currentTitle === 'christianbook.com') {
		newTitle = 'Christian Book';
	} else if (currentTitle === 'christmastreeshops.com') {
		newTitle = 'Christmas Tree Shop';
	} else if (currentTitle === 'christopherandbanks.com') {
		newTitle = 'Christopher and Banks';
	} else if (currentTitle === 'claires.com') {
		newTitle = "Claire's";
	} else if (currentTitle === 'colehaan.com') {
		newTitle = 'Cole Haan';
	} else if (currentTitle === 'columbia.com') {
		newTitle = 'Columbia';
	} else if (currentTitle === 'competitivecyclist.com') {
		newTitle = 'Competitive Cyclist';
	} else if (currentTitle === 'coolstuffinc.com') {
		newTitle = 'Cool Stuff Inc';
	} else if (currentTitle === 'costco.com') {
		newTitle = 'Costco';
	} else if (currentTitle === 'costway.com') {
		newTitle = 'Costway';
	} else if (currentTitle === 'cpooutlets.com') {
		newTitle = 'CPO Outlets';
	} else if (currentTitle === 'crabtree-evelyn.com') {
		newTitle = 'Crabtree & Evelyn';
	} else if (currentTitle === 'crayola.com') {
		newTitle = 'Crayola';
	} else if (currentTitle === 'currentcatalog.com') {
		newTitle = 'Current Catalog';
	} else if (currentTitle === 'cyclegear.com') {
		newTitle = 'Cycle Gear';
	} else if (currentTitle === 'cymax.com') {
		newTitle = 'Cymax';
	} else if (currentTitle === 'dcshoes.com') {
		newTitle = 'DC Shoes';
	} else if (currentTitle === 'dealgenius.com') {
		newTitle = 'Deal Genius';
	} else if (currentTitle === 'designtoscano.com') {
		newTitle = 'Design Toscano';
	} else if (currentTitle === 'dickies.com') {
		newTitle = 'Dickies';
	} else if (currentTitle === 'dickssportinggoods.com') {
		newTitle = "Dick's Sporting Goods";
	} else if (currentTitle === 'dillards.com') {
		newTitle = "Dillard's";
	} else if (currentTitle === 'discountdance.com') {
		newTitle = 'Discount Dance';
	} else if (currentTitle === 'discountwatchstore.com') {
		newTitle = 'Discount Watch Store';
	} else if (currentTitle === 'dollargeneral.com') {
		newTitle = 'Dollar General';
	} else if (currentTitle === 'dollartree.com') {
		newTitle = 'Dollar Tree';
	} else if (currentTitle === 'drugsupplystore.com') {
		newTitle = 'Drug Supply Store';
	} else if (currentTitle === 'dsw.com') {
		newTitle = 'DSW';
	} else if (currentTitle === 'e-cosmetorium.com') {
		newTitle = 'E-Cosmetorium';
	} else if (currentTitle === 'easton.com') {
		newTitle = 'Easton';
	} else if (currentTitle === 'ebay.com') {
		newTitle = 'eBay';
	} else if (currentTitle === 'eeboo.com') {
		newTitle = 'eeBoo';
	} else if (currentTitle === 'electriccalifornia.com') {
		newTitle = 'Electrical California';
	} else if (currentTitle === 'elementoutfitters.com') {
		newTitle = 'Element Outfitters';
	} else if (currentTitle === 'elfcosmetics.com') {
		newTitle = 'Elf Cosmetics';
	} else if (currentTitle === 'ems.com') {
		newTitle = 'Eastern Mountain Sports';
	} else if (currentTitle === 'entertainmentearth.com') {
		newTitle = 'Entertainment Earth';
	} else if (currentTitle === 'entirelypets.com') {
		newTitle = 'Entirely Pets';
	} else if (currentTitle === 'etundra.com') {
		newTitle = 'Tundra Restaurant Supply';
	} else if (currentTitle === 'everythingkitchens.com') {
		newTitle = 'Everything Kitchens';
	} else if (currentTitle === 'evitamins.com') {
		newTitle = 'eVitamins';
	} else if (currentTitle === 'evo.com') {
		newTitle = 'Evo';
	} else if (currentTitle === 'fabric.com') {
		newTitle = 'Fabric';
	} else if (currentTitle === 'familyotc.com') {
		newTitle = 'Family OTC';
	} else if (currentTitle === 'famous-smoke.com') {
		newTitle = 'Famous Smoke Shop';
	} else if (currentTitle === 'fatbraintoys.com') {
		newTitle = 'Fat Brain Toys';
	} else if (currentTitle === 'faucetdirect.com') {
		newTitle = 'Faucet Direct';
	} else if (currentTitle === 'fisher-price.com') {
		newTitle = 'Fisher-Price';
	} else if (currentTitle === 'fleetfarm.com') {
		newTitle = 'Fleet Farm';
	} else if (currentTitle === 'focalprice.com') {
		newTitle = 'Focal Price';
	} else if (currentTitle === 'footsmart.com') {
		newTitle = 'FootSmart';
	} else if (currentTitle === 'fpnyc.com') {
		newTitle = 'Forbidden Planet';
	} else if (currentTitle === 'frys.com') {
		newTitle = "Fry's";
	} else if (currentTitle === 'fun.com') {
		newTitle = 'Fun';
	} else if (currentTitle === 'fye.com') {
		newTitle = 'FYE';
	} else if (currentTitle === 'gamenerdz.com') {
		newTitle = 'Game Nerdz';
	} else if (currentTitle === 'gearbest.com') {
		newTitle = 'Gear Best';
	} else if (currentTitle === 'getolympus.com') {
		newTitle = 'Olympus';
	} else if (currentTitle === 'ghbass.com') {
		newTitle = 'GH Bass & Co';
	} else if (currentTitle === 'giggle.com') {
		newTitle = 'Giggle';
	} else if (currentTitle === 'globalgolf.com') {
		newTitle = 'Global Golf';
	} else if (currentTitle === 'gnc.com') {
		newTitle = 'GNC';
	} else if (currentTitle === 'guitarcenter.com') {
		newTitle = 'Guitar Center';
	} else if (currentTitle === 'hammacher.com') {
		newTitle = 'Hammacher-Schlemmer';
	} else if (currentTitle === 'harborfreight.com') {
		newTitle = 'Harbor Freight';
	} else if (currentTitle === 'harrietcarter.com') {
		newTitle = 'Harriet Carter';
	} else if (currentTitle === 'hasbropulse.com') {
		newTitle = 'Hasbro Pulse';
	} else if (currentTitle === 'hayneedle.com') {
		newTitle = 'Hay Needle';
	} else if (currentTitle === 'healthykin.com') {
		newTitle = 'Healthy Kin';
	} else if (currentTitle === 'healthypets.com') {
		newTitle = 'Healthy Pets';
	} else if (currentTitle === 'hearthsong.com') {
		newTitle = 'Hearth Song';
	} else if (currentTitle === 'herbergers.com') {
		newTitle = "Herberger's";
	} else if (currentTitle === 'herroom.com') {
		newTitle = 'Her Room';
	} else if (currentTitle === 'hobbylobby.com') {
		newTitle = 'Hobby Lobby';
	} else if (currentTitle === 'hockeymonkey.com') {
		newTitle = 'Hockey Monkey';
	} else if (currentTitle === 'holabirdsports.com') {
		newTitle = 'Holabird Sports';
	} else if (currentTitle === 'homedepot.com') {
		newTitle = 'Home Depot';
	} else if (currentTitle === 'hottopic.com') {
		newTitle = 'Hot Topic';
	} else if (currentTitle === 'hsn.com') {
		newTitle = 'HSN';
	} else if (currentTitle === 'iherb.com') {
		newTitle = 'iHerb';
	} else if (currentTitle === 'innexinc.com') {
		newTitle = 'Innex Inc';
	} else if (currentTitle === 'jcpenney.com') {
		newTitle = 'JCPenney';
	} else if (currentTitle === 'jefferspet.com') {
		newTitle = "Jeffer's Pet";
	} else if (currentTitle === 'jensonusa.com') {
		newTitle = 'Jenson USA';
	} else if (currentTitle === 'journeys.com') {
		newTitle = "Journey's";
	} else if (currentTitle === 'jpcycles.com') {
		newTitle = 'J&P Cycles';
	} else if (currentTitle === 'jwpepper.com') {
		newTitle = 'JW Pepper';
	} else if (currentTitle === 'katespade.com') {
		newTitle = 'Kate Spade';
	} else if (currentTitle === 'katvondbeauty.com') {
		newTitle = 'KatVonD Beauty';
	} else if (currentTitle === 'keepsakequilting.com') {
		newTitle = 'Keepsake Quilting';
	} else if (currentTitle === 'kennethcole.com') {
		newTitle = 'Kenneth Cole';
	} else if (currentTitle === 'keurig.com') {
		newTitle = 'Keurig';
	} else if (currentTitle === 'kmart.com') {
		newTitle = 'Kmart';
	} else if (currentTitle === 'knitpicks.com') {
		newTitle = 'Knit Picks';
	} else if (currentTitle === 'kohls.com') {
		newTitle = "Kohl's";
	} else if (currentTitle === 'lakeside.com') {
		newTitle = 'Lakeside';
	} else if (currentTitle === 'ldproducts.com') {
		newTitle = 'LD Products';
	} else if (currentTitle === 'lego.com') {
		newTitle = 'LEGO';
	} else if (currentTitle === 'lelandfly.com') {
		newTitle = 'Leland Fly';
	} else if (currentTitle === 'lightinthebox.com') {
		newTitle = 'Light in the Box';
	} else if (currentTitle === 'lillianvernon.com') {
		newTitle = 'Lillian Vernon';
	} else if (currentTitle === 'logitech.com') {
		newTitle = 'Logitech';
	} else if (currentTitle === 'lookfantastic.com') {
		newTitle = 'Look Fantastic';
	} else if (currentTitle === 'lowes.com') {
		newTitle = "Lowe's";
	} else if (currentTitle === 'ltdcommodities.com') {
		newTitle = 'LTD Commodities';
	} else if (currentTitle === 'luckybrand.com') {
		newTitle = 'Lucky Brand';
	} else if (currentTitle === 'luggagepros.com') {
		newTitle = 'Luggage Pros';
	} else if (currentTitle === 'lugz.com') {
		newTitle = 'Lugz';
	} else if (currentTitle === 'lumens.com') {
		newTitle = 'Lumens';
	} else if (currentTitle === 'macys.com') {
		newTitle = "Macy's";
	} else if (currentTitle === 'marcjacobs.com') {
		newTitle = 'Marc Jacobs';
	} else if (currentTitle === 'marcjacobsbeauty.com') {
		newTitle = 'Marc Jacobs Beauty';
	} else if (currentTitle === 'marvel.com') {
		newTitle = 'Marvel';
	} else if (currentTitle === 'marystack.com') {
		newTitle = "Mary's Tack & Feed";
	} else if (currentTitle === 'mattel.com') {
		newTitle = 'Mattel';
	} else if (currentTitle === 'meijer.com') {
		newTitle = 'Meijer';
	} else if (currentTitle === 'melissaanddoug.com') {
		newTitle = 'Melissa & Doug';
	} else if (currentTitle === 'menards.com') {
		newTitle = 'Mernards';
	} else if (currentTitle === 'mercola.com') {
		newTitle = 'Mercola';
	} else if (currentTitle === 'merrell.com') {
		newTitle = 'Merrell';
	} else if (currentTitle === 'michaels.com') {
		newTitle = 'Michaels';
	} else if (currentTitle === 'michaelskids.com') {
		newTitle = 'Michaels Kids';
	} else if (currentTitle === 'microcenter.com') {
		newTitle = 'Micro Center';
	} else if (currentTitle === 'midwayusa.com') {
		newTitle = 'Midway USA';
	} else if (currentTitle === 'miniaturemarket.com') {
		newTitle = 'Miniature Market';
	} else if (currentTitle === 'monoprice.com') {
		newTitle = 'Monoprice';
	} else if (currentTitle === 'moosejaw.com') {
		newTitle = 'Moosejaw';
	} else if (currentTitle === 'mountainhardwear.com') {
		newTitle = 'Mountain Hardwear';
	} else if (currentTitle === 'mountainsteals.com') {
		newTitle = 'Mountain Steals';
	} else if (currentTitle === 'musiciansfriend.com') {
		newTitle = "Musician's Friend";
	} else if (currentTitle === 'nashbar.com') {
		newTitle = 'Bike Nashbar';
	} else if (currentTitle === 'natchezss.com') {
		newTitle = 'Natchez Shooting Supplies';
	} else if (currentTitle === 'nbcstore.com') {
		newTitle = 'NBC Store';
	} else if (currentTitle === 'neimanmarcus.com') {
		newTitle = 'Neiman Marcus';
	} else if (currentTitle === 'netrition.com') {
		newTitle = 'Netrition';
	} else if (currentTitle === 'newegg.com') {
		newTitle = 'Newegg';
	} else if (currentTitle === 'neweggbusiness.com') {
		newTitle = 'Newegg Business';
	} else if (currentTitle === 'nike.com') {
		newTitle = 'Nike';
	} else if (currentTitle === 'nordstromrack.com') {
		newTitle = 'Nordstrom Rack';
	} else if (currentTitle === 'nothingbutsavings.com') {
		newTitle = 'Nothing But Savings';
	} else if (currentTitle === 'oakley.com') {
		newTitle = 'Oakley';
	} else if (currentTitle === 'officedepot.com') {
		newTitle = 'Office Depot';
	} else if (currentTitle === 'officesupply.com') {
		newTitle = 'Office Supply';
	} else if (currentTitle === 'officialstarwarscostumes.com') {
		newTitle = 'Official Star Wars Costumes';
	} else if (currentTitle === 'oldies.com') {
		newTitle = 'Oldies';
	} else if (currentTitle === 'omcgear.com') {
		newTitle = 'OMC Gear';
	} else if (currentTitle === 'oneida.com') {
		newTitle = 'Oneida';
	} else if (currentTitle === 'onlineshoes.com') {
		newTitle = 'Online Shoes';
	} else if (currentTitle === 'opticsplanet.com') {
		newTitle = 'Optics Planet';
	} else if (currentTitle === 'orientaltrading.com') {
		newTitle = 'Oriental Trading';
	} else if (currentTitle === 'origins.com') {
		newTitle = 'Origins';
	} else if (currentTitle === 'oshkosh.com') {
		newTitle = 'OshKosh';
	} else if (currentTitle === 'oup.com') {
		newTitle = 'Oxford University Press';
	} else if (currentTitle === 'overstock.com') {
		newTitle = 'Overstock';
	} else if (currentTitle === 'overtons.com') {
		newTitle = "Overton's";
	} else if (currentTitle === 'packershoes.com') {
		newTitle = 'Packer Shoes';
	} else if (currentTitle === 'pamperedchef.com') {
		newTitle = 'Papered Chef';
	} else if (currentTitle === 'parts-express.com') {
		newTitle = 'Parts Express';
	} else if (currentTitle === 'partselect.com') {
		newTitle = 'Part Select';
	} else if (currentTitle === 'partycity.com') {
		newTitle = 'Party City';
	} else if (currentTitle === 'paulaschoice.com') {
		newTitle = "Paula's Choice";
	} else if (currentTitle === 'penningtons.com') {
		newTitle = "Pennington's";
	} else if (currentTitle === 'perpetualkid.com') {
		newTitle = 'Perpetual Kid';
	} else if (currentTitle === 'pharmaca.com') {
		newTitle = 'Pharmaca';
	} else if (currentTitle === 'philosophy.com') {
		newTitle = 'Philosophy';
	} else if (currentTitle === 'pipingrock.com') {
		newTitle = 'Piping Rock';
	} else if (currentTitle === 'pishposhbaby.com') {
		newTitle = 'PishPosh Baby';
	} else if (currentTitle === 'playmobil.us') {
		newTitle = 'Playmobil';
	} else if (currentTitle === 'plowhearth.com') {
		newTitle = 'Plow & Hearth';
	} else if (currentTitle === 'power.tenergy.com') {
		newTitle = 'Tenergy Power';
	} else if (currentTitle === 'probikekit.com') {
		newTitle = 'Pro Bike Kit';
	} else if (currentTitle === 'puma.com') {
		newTitle = 'Puma';
	} else if (currentTitle === 'pureformulas.com') {
		newTitle = 'Pure Formulas';
	} else if (currentTitle === 'purehockey.com') {
		newTitle = 'Pure Hockey';
	} else if (currentTitle === 'puritan.com') {
		newTitle = 'Puritan';
	} else if (currentTitle === 'pyramydair.com') {
		newTitle = 'Pyramyd Air';
	} else if (currentTitle === 'quadratec.com') {
		newTitle = 'Quadratec';
	} else if (currentTitle === 'quiksilver.com') {
		newTitle = 'Quiksilver';
	} else if (currentTitle === 'quill.com') {
		newTitle = 'Quill';
	} else if (currentTitle === 'qvc.com') {
		newTitle = 'QVC';
	} else if (currentTitle === 'radioshack.com') {
		newTitle = 'RadioShack';
	} else if (currentTitle === 'rallyhouse.com') {
		newTitle = 'Rally House';
	} else if (currentTitle === 'rcwilley.com') {
		newTitle = 'RC Willey';
	} else if (currentTitle === 'rei.com') {
		newTitle = 'REI';
	} else if (currentTitle === 'repairclinic.com') {
		newTitle = 'Repair Clinic';
	} else if (currentTitle === 'restaurantsupply.com') {
		newTitle = 'Restaurant Supply';
	} else if (currentTitle === 'revolve.com') {
		newTitle = 'Revolve';
	} else if (currentTitle === 'revzilla.com') {
		newTitle = 'Revzilla';
	} else if (currentTitle === 'roamans.com') {
		newTitle = "Roaman's";
	} else if (currentTitle === 'rockport.com') {
		newTitle = 'Rockport';
	} else if (currentTitle === 'rogansshoes.com') {
		newTitle = "Rogan's Shoes";
	} else if (currentTitle === 'ronjonsurfshop.com') {
		newTitle = 'Ron Jon Surf Shop';
	} else if (currentTitle === 'runningwarehouse.com') {
		newTitle = 'Running Warehouse';
	} else if (currentTitle === 'ruralking.com') {
		newTitle = 'Rural King';
	} else if (currentTitle === 'saksfifthavenue.com') {
		newTitle = 'Saks Fifth Avenue';
	} else if (currentTitle === 'saksoff5th.com') {
		newTitle = 'Saks Off Fifth';
	} else if (currentTitle === 'sallybeauty.com') {
		newTitle = 'Sally Beauty';
	} else if (currentTitle === 'samsclub.com') {
		newTitle = "Sam's Club";
	} else if (currentTitle === 'sanuk.com') {
		newTitle = 'Sanuk';
	} else if (currentTitle === 'saucony.com') {
		newTitle = 'Saucony';
	} else if (currentTitle === 'scheels.com') {
		newTitle = "Scheel's";
	} else if (currentTitle === 'sears.com') {
		newTitle = 'Sears';
	} else if (currentTitle === 'searsoutlet.com') {
		newTitle = 'Sears Outlet';
	} else if (currentTitle === 'sephora.com') {
		newTitle = 'Sephora';
	} else if (currentTitle === 'sheetmusicplus.com') {
		newTitle = 'Sheet Music Plus';
	} else if (currentTitle === 'sheplers.com') {
		newTitle = 'Sheplers';
	} else if (currentTitle === 'shoecarnival.com') {
		newTitle = 'Shoe Carnival';
	} else if (currentTitle === 'shoes.com') {
		newTitle = 'Shoes';
	} else if (currentTitle === 'shopbop.com') {
		newTitle = 'Shop Bop';
	} else if (currentTitle === 'shopdisney.com') {
		newTitle = 'Shop Disney';
	} else if (currentTitle === 'shopyourway.com') {
		newTitle = 'Shop Your Way';
	} else if (currentTitle === 'shovelandhoe.com') {
		newTitle = 'Shovel and Hoe';
	} else if (currentTitle === 'shuuemura-usa.com') {
		newTitle = 'Shu Uemura';
	} else if (currentTitle === 'sierra.com') {
		newTitle = 'Sierra';
	} else if (currentTitle === 'simplicity.com') {
		newTitle = 'Simplicity';
	} else if (currentTitle === 'smartpakequine.com') {
		newTitle = 'SmartPak Equine';
	} else if (currentTitle === 'softball.com') {
		newTitle = 'Softball';
	} else if (currentTitle === 'solidsignal.com') {
		newTitle = 'Solid Signal';
	} else if (currentTitle === 'spencersonline.com') {
		newTitle = "Spencer's";
	} else if (currentTitle === 'sperry.com') {
		newTitle = 'Sperry';
	} else if (currentTitle === 'sportsmansguide.com') {
		newTitle = 'Sportsman Guide';
	} else if (currentTitle === 'sstack.com') {
		newTitle = 'SSTack';
	} else if (currentTitle === 'ssww.com') {
		newTitle = 'SSWW';
	} else if (currentTitle === 'staples.com') {
		newTitle = 'Staples';
	} else if (currentTitle === 'steepandcheap.com') {
		newTitle = 'Steep and Cheap';
	} else if (currentTitle === 'step2.com') {
		newTitle = 'Step 2';
	} else if (currentTitle === 'stonewallkitchen.com') {
		newTitle = 'Stonewall Kitchen';
	} else if (currentTitle === 'sunandski.com') {
		newTitle = 'Sun & Ski';
	} else if (currentTitle === 'sunnysports.com') {
		newTitle = 'Sunny Sports';
	} else if (currentTitle === 'superbiiz.com') {
		newTitle = 'Super Biiz';
	} else if (currentTitle === 'surlatable.com') {
		newTitle = 'Sur La Table';
	} else if (currentTitle === 'swimsuitsforall.com') {
		newTitle = 'Swimsuits For All';
	} else if (currentTitle === 'tacticalgear.com') {
		newTitle = 'Tactical Gear';
	} else if (currentTitle === 'tactics.com') {
		newTitle = 'Tactics';
	} else if (currentTitle === 'tanga.com') {
		newTitle = 'Tanga';
	} else if (currentTitle === 'target.com') {
		newTitle = 'Target';
	} else if (currentTitle === 'telescope.com') {
		newTitle = 'Orion';
	} else if (currentTitle === 'tfaw.com') {
		newTitle = 'Things From Another World';
	} else if (currentTitle === 'thatpetplace.com') {
		newTitle = 'That Pet Place';
	} else if (currentTitle === 'the-house.com') {
		newTitle = 'The House Outdoor Gear';
	} else if (currentTitle === 'theartofshaving.com') {
		newTitle = 'The Art of Shaving';
	} else if (currentTitle === 'thepartsbiz.com') {
		newTitle = 'The Parts Biz';
	} else if (currentTitle === 'theshoemart.com') {
		newTitle = 'The Shoe Market';
	} else if (currentTitle === 'thrivemarket.com') {
		newTitle = 'Thrive Market';
	} else if (currentTitle === 'tigerdirect.com') {
		newTitle = 'Tiger Direct';
	} else if (currentTitle === 'tintoyarcade.com') {
		newTitle = 'Tin Toy Arcade';
	} else if (currentTitle === 'toofaced.com') {
		newTitle = 'Too Faced';
	} else if (currentTitle === 'towerhobbies.com') {
		newTitle = 'Tower Hobbies';
	} else if (currentTitle === 'toytokyo.com') {
		newTitle = 'Toy Tokyo';
	} else if (currentTitle === 'toywiz.com') {
		newTitle = 'Toy Wiz';
	} else if (currentTitle === 'truevalue.com') {
		newTitle = 'True Value';
	} else if (currentTitle === 'udans.com') {
		newTitle = "Uncle Dan's";
	} else if (currentTitle === 'ulta.com') {
		newTitle = 'Ulta';
	} else if (currentTitle === 'ustoy.com') {
		newTitle = 'US Toy';
	} else if (currentTitle === 'vat19.com') {
		newTitle = 'Vat 19';
	} else if (currentTitle === 'vitacost.com') {
		newTitle = 'Vitacost';
	} else if (currentTitle === 'vitalitymedical.com') {
		newTitle = 'Vitality Medical';
	} else if (currentTitle === 'vitaminlife.com') {
		newTitle = 'Vitamin Life';
	} else if (currentTitle === 'vitaminshoppe.com') {
		newTitle = 'Vitamin Shoppe';
	} else if (currentTitle === 'vitaminworld.com') {
		newTitle = 'Vitamin World';
	} else if (currentTitle === 'vminnovations.com') {
		newTitle = 'VM Innovations';
	} else if (currentTitle === 'walgreens.com') {
		newTitle = 'Walgreens';
	} else if (currentTitle === 'walmart.com') {
		newTitle = 'Walmart';
	} else if (currentTitle === 'watchshop.com') {
		newTitle = 'Watch Shop';
	} else if (currentTitle === 'wayfair.com') {
		newTitle = 'Wayfair';
	} else if (currentTitle === 'wdrake.com') {
		newTitle = 'Walter Drake';
	} else if (currentTitle === 'westmarine.com') {
		newTitle = 'West Marine';
	} else if (currentTitle === 'wholesalehalloweencostumes.com') {
		newTitle = 'Wholesale Halloween Costumes';
	} else if (currentTitle === 'williams-sonoma.com') {
		newTitle = 'Williams-Sonoma';
	} else if (currentTitle === 'wilsonsleather.com') {
		newTitle = "Wilson's Leather";
	} else if (currentTitle === 'woodcraft.com') {
		newTitle = 'Woodcraft';
	} else if (currentTitle === 'woot.com') {
		newTitle = 'Woot!';
	} else if (currentTitle === 'worldmarket.com') {
		newTitle = 'World Market';
	} else if (currentTitle === 'younkers.com') {
		newTitle = 'Younkers';
	} else if (currentTitle === 'zappos.com') {
		newTitle = 'Zappos';
	} else if (currentTitle === 'zulily.com') {
		newTitle = 'Zulily';
	} else if (currentTitle === 'zumiez.com') {
		newTitle = 'Zumiez';
	} else if (currentTitle === 'zzounds.com') {
		newTitle = 'ZZ Sounds';
	} else {
		newTitle = 'INPUT STORE NAME';
	}
	return newTitle;
}

export const openLinkHandler = (e, retailerLink, amzLink) => {
	e.preventDefault();
	window.open(retailerLink);
	window.open(amzLink);
};

export function useStickyState(defaultValue, key) {
	const [value, setValue] = React.useState(() => {
		const stickyValue = window.localStorage.getItem(key);
		return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
	});
	React.useEffect(() => {
		window.localStorage.setItem(key, JSON.stringify(value));
	}, [key, value]);
	return [value, setValue];
}

export const useOutsideMousedown = (ref, setState_1, setState_2) => {
	useEffect(() => {
		function handleClickOutside(event) {
			if (ref.current && !ref.current.contains(event.target)) {
				setState_1(false);
				if (setState_2) {
					setState_2(false);
				}
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [ref, setState_1, setState_2]);
};

export const useOutsideMouseup = (ref, setState_1, setState_2) => {
	useEffect(() => {
		function handleClickOutside(event) {
			if (ref.current && !ref.current.contains(event.target)) {
				setState_1(false);
				if (setState_2) {
					setState_2(false);
				}
			}
		}
		document.addEventListener('mouseup', handleClickOutside);
		return () => {
			document.removeEventListener('mouseup', handleClickOutside);
		};
	}, [ref, setState_1, setState_2]);
};
