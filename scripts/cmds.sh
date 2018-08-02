#!/bin/bash
clear

# | awk 'match(\$0, /".*"/){print substr(\$0,RSTART+1,RLENGTH-2)}' |  sed  's/\\\"/\"/g' | jq
cmd[1]=$(cat <<-END
peer chaincode invoke --orderer localhost:7050 --channelID mychannel \
 -c '{"Args":["org.example.commercialpaper_RetrieveMarket","US_BLUE_ONE"]}' \
 -n CommercialPaper 2>&1 | awk 'match(\$0, /".*"/){print substr(\$0,RSTART+1,RLENGTH-2)}' |  sed  's/\\\"/\"/g' | jq
END
)

cmd[2]=$(cat <<-END
peer chaincode invoke --orderer localhost:7050 --channelID mychannel \
 -c '{"Args":["org.example.commercialpaper_CreatePaper","CP-2-8107245-AG","240","10500"]}' \
 -n CommercialPaper 2>&1  
END
)

cmd[3]=$(cat <<-END
peer chaincode invoke --orderer localhost:7050 --channelID mychannel \
 -c '{"Args":["org.example.commercialpaper_ListOnMarket","US_BLUE_ONE","5","CP-2-8107245-AG" ]}' \
 -n CommercialPaper 2>&1  
END
)

cmd[4]=$(cat <<-END
peer chaincode install --lang node --name CommercialPaper --version v0 --path ~/chaincode-commercialpaper/contracts
END
)

cmd[5]=$(cat <<-END
peer chaincode instantiate --orderer localhost:7050 --channelID mychannel --lang node \
--name CommercialPaper --version v0 -c '{"Args":["org.example.commercialpaper_Setup"]}'
END
)


c=1;

for i in "${cmd[@]}"
do
    echo [${c}]
	echo $i
    ((c++))
    echo -----------------------------------------------------
done

