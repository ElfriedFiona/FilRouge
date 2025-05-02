<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notification de service</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .email-container {
            background-color: #fff;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 600px;
            animation: fadeIn 0.5s ease-out;
        }
        h2 {
            color: #007bff;
            margin-top: 0;
            margin-bottom: 20px;
            font-size: 28px;
            letter-spacing: -0.5px;
        }
        p {
            margin-bottom: 15px;
            font-size: 16px;
            color: #555;
        }
        strong {
            color: #222;
            font-weight: 700;
        }
        ul {
            list-style: none;
            padding: 0;
            margin-bottom: 20px;
        }
        li {
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        li:last-child {
            border-bottom: none;
        }
        li strong {
            display: inline-block;
            width: 150px;
            font-weight: 600;
            color: #333;
        }
        .signature {
            margin-top: 30px;
            font-style: italic;
            color: #777;
        }
        .accent-color {
            color: #28a745;
        }
        .decision-acceptee {
            color: #198754;
            font-weight: bold;
        }
        .decision-refusee {
            color: #dc3545;
            font-weight: bold;
        }
        .decision-terminee {
            color: #0d6efd;
            font-weight: bold;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h2>Bonjour {{ $userName }},</h2>

        @php
            $decisionLower = strtolower($decision);
            $decisionClass = match($decisionLower) {
                'acceptée' => 'decision-acceptee',
                'refusée' => 'decision-refusee',
                'terminée' => 'decision-terminee',
                default => '',
            };
        @endphp

        <p>
            @if($decisionLower === 'terminée')
                Le service suivant a été <strong class="{{ $decisionClass }}">{{ $decisionLower }}</strong> par l'artisan <strong class="accent-color">{{ $artisanName }}</strong> :
            @else
                L'artisan <strong class="accent-color">{{ $artisanName }}</strong> a <strong class="{{ $decisionClass }}">{{ $decisionLower }}</strong> votre demande de service :
            @endif
        </p>

        <ul>
            <li><strong>Type de service :</strong> {{ $service->type_de_service }}</li>
            <li><strong>Description :</strong> {{ $service->description }}</li>
            <li><strong>Budget :</strong> {{ $service->budget }} FCFA</li>
            <li><strong>Date souhaité :</strong> {{ $service->date_limite }}</li>
        </ul>

        <p>Merci d'utiliser notre plateforme.</p>

        <p class="signature">— L’équipe de l'application</p>
    </div>
</body>
</html>
