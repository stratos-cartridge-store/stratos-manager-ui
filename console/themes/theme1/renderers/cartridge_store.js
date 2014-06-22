var render = function (theme, data, meta, require) {

    if(data.error.length == 0 ){


        theme('index', {
            body: [
                {
                    partial: 'cartridge_store',
                    context: {
                        title:'Cartridge Store'
                    }
                }
            ],
            header: [
                {

                    has_action_buttons:false,
                    partial: 'header',
                    context:{
                        title:'Cartridge Store',
                        store_selected:true,
                        button:{
                            link:'/',
                            name:''
                        },
                        has_help:true,
                        help:'You can add cartridges from store..'
                    }
                }
            ],
            title:[
                {
                    partial:'title',
                    context:{
                        title:"Cartridge Store"
                    }
                }
            ]
        });

    }else{

        theme('index', {
            body: [
                {
                    partial: 'error_page',
                    context: {
                        title:'Error',
                        error:data.error
                    }
                }
            ],
            header: [
                {
                    has_action_buttons:false,
                    partial: 'header',
                    context:{
                        title:'Cartridge store',
                        store_selected:true,
                        button:{
                            link:'/',
                            name:''
                        },
                        has_help:true,
                        help:'You can add cartridges from store..'
                    }
                }
            ],
            title: [
                {
                    partial: 'title',
                    context: {
                        title: "Cartridge Store"
                    }
                }
            ]
        });

    }

}