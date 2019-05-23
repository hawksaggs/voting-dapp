App = {
    web3Provider: null,
    contracts: {},
    account: '0x',
    candidates: { "Rama": "candidate-1", "Nick": "candidate-2", "Jose": "candidate-3", "Ayush":"candidate-4", "Charlie": "candidate-5"},
    init: function () {
        console.log('App initialized...');
        return App.initWeb3();
    },
    initWeb3: function () {
        if (typeof web3 != 'undefined') {
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(App.web3Provider);
        } else {
            App.web3Provider = new Web3.providers.HttpProvider("http://localhost:8545");
            web3 = new Web3(App.web3Provider);
        }

        // Check the connection
        if(!web3.isConnected()) {
            console.error("Not connected");

        }
        console.log(web3);
        return App.initContract();
    },
    initContract: function () {
        $.getJSON("Voting.json", function (voting) {
            App.contracts.Voting = TruffleContract(voting);
            App.contracts.Voting.setProvider(App.web3Provider);
            App.contracts.Voting.deployed()
                .then(function (voting) {
                    console.log('Voting address: ', voting.address);
                    return App.render();
                });

            
        });
    },
    render: function () {
        web3.eth.getCoinbase(function (err, account) {
            if (err) {
                console.log(err);
                alert('No account found');
                return;
            }
            if (!err) {
                App.account = account;
            }
        });
        let candidateNames = Object.keys(App.candidates);
        for (var i = 0; i < candidateNames.length; i++) {
            let name = candidateNames[i];
            App.contracts.Voting.deployed().then(function (contractInstance) {
                contractInstance.countVote.call(name).then(function (v) {
                    $("#" + App.candidates[name]).html(v.toString());
                });
            })
        }

    },
    voteForCandidate: function () {
        let candidateName = $('#candidate').val();
        let div_id = App.candidates[candidateName];
        if(!div_id) {
            $('#msg').html('Not valid name');
            return;
        }
        try {
            $("#msg").html("Vote has been submitted. The vote count will increment as soon as the vote is recorded on the blockchain. Please wait.")
            $("#candidate").val("");
            App.contracts.Voting.deployed()
                .then(function (contractInstance) {
                    contractInstance.casteVote(candidateName, {
                        gas: 140000,
                        from: App.account,
                    })
                        .then(function (data) {
                            return contractInstance.countVote.call(candidateName).then(function (v) {
                                $("#" + div_id).html(v.toString());
                                $("#msg").html("");
                            });
                        })
                });
        } catch (error) {
            console.error(error);
        }
    }
}

$(function () {
    $(window).load(function () {
        App.init();
    });
});