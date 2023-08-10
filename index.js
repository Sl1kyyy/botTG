const token = '6408738363:AAEAcg1o2Mi6NAyVScsPe_JicmSv0appk-U';
const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options')
const bot = new TelegramApi(token, {polling:true})

const chats = {};






const startGame = async(chatId) =>{
    await bot.sendMessage(chatId, 'Сейчас я загадаю число от 0 до 9,а ты должен его угадать')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветсвие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Игра угадай число'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;


        if(text === '/start'){
            await bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/s/ShrekFreetopsticker/ShrekFreetopsticker_033.webp?v=1688394902')
            return bot.sendMessage(chatId, `Добро пожаловать в моего первого телеграм бота`)
        }
        if(text === '/info'){
            return bot.sendMessage(chatId, `Тебя зовут  ${msg.from.first_name}`);
        }
        if(text === '/game'){
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю,попробуй ещё раз')


    })

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again'){
            startGame(chatId);
        }
        if(data === chats[chatId]){
            return  bot.sendMessage(chatId, `Поздравляю,ты угадал число ${chats[chatId]}`, againOptions)
        }else {
            return bot.sendMessage(chatId, `К сожалению ты не угадал,бот загадал число ${chats[chatId]}`, againOptions)
        }
    })
}

start()