<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Toute personne authentifiée (client/artisan/admin)
     * peut lister les artisans.
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $authUser)
    {
        return in_array($authUser->role, ['client', 'artisan', 'admin']);
    }

    /**
     * Voir un profil utilisateur.
     * - admin voit tout
     * - client/ artisan voient tout profil d'artisan
     * - chacun voit son propre profil
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\User  $model
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $authUser, User $user)
    {
        if ($authUser->role === 'admin') {
            return true;
        }
        if ($authUser->id === $user->id) {
            return true;
        }
        // clients et artisans peuvent voir les artisans
        return $user->role === 'artisan';
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        //
    }

    /**
     * Mettre à jour un profil.
     * - admin peut tout
     * - chacun ne peut modifier que son propre profil
     * @param  \App\Models\User  $user
     * @param  \App\Models\User  $model
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $authUser, User $user)
    {
        return $authUser->role === 'admin'
            || $authUser->id === $user->id;
    }
    /**
     * Changer l'état (actif/inactif).
     * - seul l'admin peut modifier l'état d'un autre
     * @param  \App\Models\User  $user
     * @param  \App\Models\User  $model
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function changeEtat(User $authUser, User $user)
    {
        return $authUser->role === 'admin'
            && $authUser->id !== $user->id;
    }

    /**
     * Supprimer un utilisateur.
     * - seul l'admin
     * @param  \App\Models\User  $user
     * @param  \App\Models\User  $model
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $authUser, User $user)
    {
        return $authUser->role === 'admin'
            || $authUser->id === $user->id;
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\User  $model
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, User $model)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\User  $model
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, User $model)
    {
        //
    }
}
