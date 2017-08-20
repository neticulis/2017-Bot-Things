class MedianLog {
	constructor(data=null){
		this.medianMid=null;
		this.medianShort=null;
		this.medianTiny=null;
		this.medianOverflow=null;
		this.medianFlow=null;
		this.medAvg1=null;
		this.medAvg2=null;
		this.medAvg3=null;
		this.q1Median=null;
		this.q2Median=null;
		this.q3Median=null;
		this.q4Median=null;
		this.g15Median=null;
		this.g24Median=null;
		this.g32Median=null;
		this.avg8QuadHigh=null;
		this.avg8QuadLow=null;
		this.med8QuadHigh=null; // 8 quadrant high median
		this.med8QuadLow=null; // 8 quadrant high median
		this.med8QuadComb=null; // 8 quadrant low+high combined median
		this.avgMIncrease=null;
		this.avgMDecrease=null;
		this.last64Crashes=null;
		this.averageQuadrentLowCrash=[];
		this.averageQuadrentHighCrash=[];
		this.averageQuadrentComb=[];
		this.avgDecrease=null;
		this.avgIncrease=null;
		this.medianIncreasing=false;
		
		this.mediansGenerated=false;
	}
	generate_medians(data=null){
		if (crashes.history.length>70){
			this.q1Median=crashes.median(4,0);
			this.q2Median=crashes.median(5,4);
			this.q3Median=crashes.median(6,9);
			this.q4Median=crashes.median(7,15);
			this.g15Median=crashes.median(15,0);
			this.g24Median=crashes.median(24,0);
			this.g32Median=crashes.median(32,0);
			this.medianMid=crashes.median(69);
			this.medianShort=crashes.median(33);
			this.medianTiny=crashes.median(11);
			this.medianOverflow=this.medianMid%this.medianShort%this.medianTiny;
			this.medianFlow=((this.medianMid-1)%this.medianOverflow);
			
			this.medAvg1=((((this.q1Median+this.q2Median+this.q3Median+this.q4Median)/4)+this.g15Median)/2);
			// medavg2 is 4 quadrant (4-7) average, averaged with 15 game, averaged with 24 game
			this.medAvg2=((((((this.q1Median+this.q2Median+this.q3Median+this.q4Median)/4)+this.g15Median)/2)+this.g24Median)/2);
			// medavg3 is 4 quadrant (4-7) average, averaged with 15 game, averaged with 24 game, averaged with 32 game median
			this.medAvg3=((((((((this.q1Median+this.q2Median+this.q3Median+this.q4Median)/4)+this.g15Median)/2)+this.g24Median)/2)+this.g32Median)/2);
			if (this.medAvg1>this.medAvg2 && this.medAvg2>this.medAvg3){
				// Median average rising
				this.avgMIncrease=((this.medAvg1-this.medAvg2)+(this.medAvg2-this.medAvg3))/2;
			} 
			else if (this.medAvg1<this.medAvg2 && this.medAvg2<this.medAvg3){
				// Median average falling
				this.avgMDecrease=((this.medAvg3-this.medAvg2)+(this.medAvg2-this.medAvg1))/2;
			}
			else {
				// Median Average Bi Directional
				this.avgMDecrease=0;
				this.avgMIncrease=0;
			}
			this.last64Crashes=crashes.history.slice(0,64);
			// we take the lowest multiplier from 8 quadrants: sized 4 - 11
			this.averageQuadrentLowCrash=[];
			this.averageQuadrentHighCrash=[];

			this.averageQuadrentLowCrash.push(this.last64Crashes.slice(0,4).sort((a,b)=>a<b).pop());
			this.averageQuadrentLowCrash.push(this.last64Crashes.slice(4,9).sort((a,b)=>a<b).pop());
			this.averageQuadrentLowCrash.push(this.last64Crashes.slice(9,15).sort((a,b)=>a<b).pop());
			this.averageQuadrentLowCrash.push(this.last64Crashes.slice(15,22).sort((a,b)=>a<b).pop());
			this.averageQuadrentLowCrash.push(this.last64Crashes.slice(22,30).sort((a,b)=>a<b).pop());
			this.averageQuadrentLowCrash.push(this.last64Crashes.slice(30,39).sort((a,b)=>a<b).pop());
			this.averageQuadrentLowCrash.push(this.last64Crashes.slice(39,49).sort((a,b)=>a<b).pop());
			this.averageQuadrentLowCrash.push(this.last64Crashes.slice(49,60).sort((a,b)=>a<b).pop());
			this.med8QuadLow=((this.averageQuadrentLowCrash[3]+this.averageQuadrentLowCrash[4])/2);
			this.averageQuadrentComb=this.averageQuadrentLowCrash;
			this.averageQuadrentHighCrash.push(this.last64Crashes.slice(0,4).sort((a,b)=>a>b).pop());
			this.averageQuadrentHighCrash.push(this.last64Crashes.slice(4,9).sort((a,b)=>a>b).pop());
			this.averageQuadrentHighCrash.push(this.last64Crashes.slice(9,15).sort((a,b)=>a>b).pop());
			this.averageQuadrentHighCrash.push(this.last64Crashes.slice(15,22).sort((a,b)=>a>b).pop());
			this.averageQuadrentHighCrash.push(this.last64Crashes.slice(22,30).sort((a,b)=>a>b).pop());
			this.averageQuadrentHighCrash.push(this.last64Crashes.slice(30,39).sort((a,b)=>a>b).pop());
			this.averageQuadrentHighCrash.push(this.last64Crashes.slice(39,49).sort((a,b)=>a>b).pop());
			this.averageQuadrentHighCrash.push(this.last64Crashes.slice(49,60).sort((a,b)=>a>b).pop());
			this.med8QuadHigh=((this.averageQuadrentHighCrash[3]+this.averageQuadrentHighCrash[4])/2);
			this.avg8QuadHigh=Math.ceil(this.averageQuadrentHighCrash.reduce((a,b,c)=>((a+b)))/8);
			this.averageQuadrentComb=this.averageQuadrentComb.concat(this.averageQuadrentHighCrash);
			this.avg8QuadLow=Math.ceil(this.averageQuadrentLowCrash.reduce((a,b,c)=>((a+b)))/8);
			this.med8QuadComb=((this.averageQuadrentComb[7]+this.averageQuadrentComb[8])/2);
			

			if (this.averageQuadrentLowCrash[0]<this.averageQuadrentLowCrash[1] && this.averageQuadrentLowCrash[1]<this.averageQuadrentLowCrash[2] && this.averageQuadrentLowCrash[2]<this.averageQuadrentLowCrash[3] && this.averageQuadrentLowCrash[3]<this.averageQuadrentLowCrash[4] && this.averageQuadrentLowCrash[4]<this.averageQuadrentLowCrash[5] && this.averageQuadrentLowCrash[5]<this.averageQuadrentLowCrash[6] && this.averageQuadrentLowCrash[6]<this.averageQuadrentLowCrash[7]) {
				// lowest multi increased over all 8 quadrents
				this.avgDecrease=((this.averageQuadrentLowCrash[7]-this.averageQuadrentLowCrash[6])+(this.averageQuadrentLowCrash[6]-this.averageQuadrentLowCrash[5])+(this.averageQuadrentLowCrash[5]-this.averageQuadrentLowCrash[4])+(this.averageQuadrentLowCrash[4]-this.averageQuadrentLowCrash[3])+(this.averageQuadrentLowCrash[3]-this.averageQuadrentLowCrash[2])+(this.averageQuadrentLowCrash[2]-this.averageQuadrentLowCrash[1])+(this.averageQuadrentLowCrash[1]-this.averageQuadrentLowCrash[0]))/7;

			} 
			else if (this.averageQuadrentLowCrash[0]>this.averageQuadrentLowCrash[1] && this.averageQuadrentLowCrash[1]>this.averageQuadrentLowCrash[2] && this.averageQuadrentLowCrash[2]>this.averageQuadrentLowCrash[3] && this.averageQuadrentLowCrash[3]>this.averageQuadrentLowCrash[4] && this.averageQuadrentLowCrash[4]>this.averageQuadrentLowCrash[5] && this.averageQuadrentLowCrash[5]>this.averageQuadrentLowCrash[6] && this.averageQuadrentLowCrash[6]>this.averageQuadrentLowCrash[7]) {
				// lowest multi increased over all 8 quadrents
				this.avgIncrease=((this.averageQuadrentLowCrash[6]-this.averageQuadrentLowCrash[7])+(this.averageQuadrentLowCrash[5]-this.averageQuadrentLowCrash[6])+(this.averageQuadrentLowCrash[4]-this.averageQuadrentLowCrash[5])+(this.averageQuadrentLowCrash[3]-this.averageQuadrentLowCrash[4])+(this.averageQuadrentLowCrash[2]-this.averageQuadrentLowCrash[3])+(this.averageQuadrentLowCrash[1]-this.averageQuadrentLowCrash[2])+(this.averageQuadrentLowCrash[0]-this.averageQuadrentLowCrash[1]))/7;
				this.avg8QuadLow=Math.ceil(this.averageQuadrentLowCrash.reduce((a,b,c)=>((a+b)))/8);
				

			} else {

				this.avg8QuadLow=Math.ceil(this.averageQuadrentLowCrash.reduce((a,b,c)=>((a+b)))/8);
				

			}
			if (this.avgMIncrease!=null && this.avgMIncrease>=1){
				// What do we want to do if the median is increasing.
				this.medianIncreasing=true;
			} 
			else if (this.avgMDecrease!=null && this.avgMDecrease>=1){
				// What do we want to do if the median is decreasing.
				this.medianIncreasing=false;
			}
			
			console.log('Medians generated.');
			this.mediansGenerated=true;
			
		} else {
			console.log('Need crash history for at least 70 games. Medians not calculated.');
			this.mediansGenerated=false;
			
		}
	}
	game_crash(data = null){
		
	}
	game_starting(data = null){}
	game_started(data = null){}
	player_bet(data = null){}
	cashed_out(data = null){}
	msg(data = null) {}
	
}
