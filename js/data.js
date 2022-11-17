const domain = "dahianlamindaki.de";
const quizLimit = 10; // default: 10
const answerTime = 20; //default: 15

// Cevapların görünür olması yalnızca farkındalık amaçlı yapılan bu proje açısından sorun teşkil etmemektedir. Teşekkürler.

const quizData = [
    {
        question: "Aşağıdaki cümlelerin hangisinde yazım yanlışı yapılmıştır?",
        a: "Anıt ağaçlar, geçmiş ile de günümüz ile de bağ kurar.",
        b: "Yörenin kültüründe anıt ağaçların özel bir yeri vardır.",
        c: "Anıt ağaçlar, yaş ve gövde olarakta daha büyüktür.",
        d: "Anıt ağaçların uzunlukları da standartların üzerindedir.",
        correct: "c",
    },
    {
        question: "Aşağıdaki cümlelerin hangisinde yazım yanlışı yoktur?",
        a: "\“Tarihi anıt ağaç\” tarihî bir olaya yada şahsiyete tanıklık etmiştir.",
        b: "“Boyutsal anıt ağaçlar” çok büyüktür vede 100 yıllık ömre ulaşır.",
        c: "“Folklorik anıt ağaçların” geleneklerde yeri vardır.",
        d: "Yöresel inançlar da yüceltilen ağaçlar “mistik anıt ağaç”tır.",
        correct: "c",
    },
    {
        question: "Aşağıdaki cümlelerin hangisinde yazım yanlışı yapılmıştır?",
        a: "Anıt ağaçlar, günümüz de bilimsel bir öneme sahiptir.",
        b: "Anıt ağaçlar birçok sanatçıya da ilham kaynağı olmuştur.",
        c: "Anıt ağaçlar destanlarda ve mitolojik öykülerde yer alır.",
        d: "Anıt ağaçların geleceğe bırakılması da önemlidir.",
        correct: "a",
    },
    {
        question: "Aşağıdaki cümlelerin hangisinde yazım yanlışı yoktur?",
        a: "Anıt ağaçların kültürel yada boyutsal bir özelliğinin olması gerekir.",
        b: "Bir ağaç da folklorik nitelik varsa “doğrudan anıt ağaç” kabul edilir.",
        c: "Anıt ağaçların 1., 2. yada 3. sınıf orman içinde yer alması gerekir.",
        d: "Anıt ağaçların Asgari Anıtsal Değeri’nin de olması gerekir.",
        correct: "d",
    },
    {
        question: "Aşağıdaki cümlelerin hangisinde yazım yanlışı yapılmıştır?",
        a: "Anıt ağaçlarda mantar ve bakteri için dezenfeksiyon uygulanır.",
        b: "Anıt ağacın pürüzlü yüzeylerin de zarar vermeden temizlik yapılır.",
        c: "Anıt ağacın çevresinde koruyucu ahşap bir çit örülür.",
        d: "Bakım sonrasında anıt ağaca bilgilendirici tabela asılır. ",
        correct: "b",
    },
    {
        question: "Aşağıdaki cümlelerin hangisinde yazım yanlışı yapılmıştır?",
        a: "Böceklerin saldırdığı zeytin ağaçlarına da yardım edilir.",
        b: "Bakıma muhtaç zeytin ağaçları mevzuata uygun şekil de temizlenir.",
        c: "Anıt zeytin ağacı gövdesindeki ölmüş dokular da temizlenir.",
        d: "Açık kovuklar da hava alacak şekilde kaplanır.",
        correct: "b",
    },
    {
        question: "Aşağıdaki cümlelerin hangisinde yazım yanlışı yoktur?",
        a: "Manisa’da 229 adet anıtsal zeytin ağacı tespit edildi.",
        b: "Anıt ağaçlar ortalama da 1000 yıl yaşar.",
        c: "2018’den bu yana yaklaşık 20 milyon zeytin ağacıda taranmıştır.",
        d: "Birçok şehir de 310 adet zeytin ağacı, “Anıt Ağaç” olarak tescillenmiştir.",
        correct: "a",
    },
    {
        question: "Aşağıdaki cümlelerin hangisinde yazım yanlışı yapılmıştır?",
        a: "Zeytin ağacı kalıntılarına 12 bin yıl öncesinde de rastlanır.",
        b: "Zeytin ağaçları, ekolojik sistemde çok önemlidir.",
        c: "Morfogenetik yenilenme sayesin de zeytin ağacı uzun yaşar.",
        d: "Zeytin ağaçları hem yazın hem de kışın yeşilliğini korur.",
        correct: "c",
    },
    {
        question: "Aşağıdaki cümlelerin hangisinde yazım yanlışı yoktur?",
        a: "Zeytin çekirdeğinin dış yapısıda oldukça sert ve odunsudur.",
        b: "Karatavuk adıylada bilinen kuşlar, zeytin çekirdeklerini kırarak yutar. ",
        c: "Olgun bir zeytin ağacında üretim ortalaması 25 ile 90 kg arasındadır.",
        d: "İyi verim almak için zeytin ağaçları 30-40 yaş arasın da olmalıdır.",
        correct: "c",
    },
    {
        question: "Aşağıdaki cümlelerin hangisinde yazım yanlışı yapılmıştır?",
        prefix: "Kuşaklar boyu yaşasın diye;",
        a: "Saruhanlı anıt zeytin ağacının da 2005 yaşında olduğu saptanmıştır.",
        b: "10,5 metre boyundaki Saruhanlı anıt zeytin ağacınında tescil işlemleri başlamıştır.",
        c: "2090 yaşındaki On Kardeşler Zeytin Ağacı da eko-turizm için korunmaya alınmıştır.",
        d: "Budama ve bakım yapılarak, yaşlı zeytin ağaçları da doğal miras olarak tescil ettirilecek.",
        correct: "b",
    },
];